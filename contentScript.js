let isInspectorActive = false;
let tooltipEl = null;

// 메시지 수신: Inspector 활성화/비활성화
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "TOGGLE_INSPECTOR") {
    
    // 메시지 처리 로직
    console.log("Received message:", message);
    sendResponse({ status: "Inspector toggled" });

    isInspectorActive = !isInspectorActive;

    if (isInspectorActive) {
      activateInspector();
    } else {
      deactivateInspector();
    }
  }
});

function activateInspector() {
  if (!tooltipEl) {
    createTooltip();
  }

  document.addEventListener("mouseover", handleMouseOver);
  document.addEventListener("mouseout", handleMouseOut);
}

function deactivateInspector() {
  document.removeEventListener("mouseover", handleMouseOver);
  document.removeEventListener("mouseout", handleMouseOut);

  if (tooltipEl) {
    tooltipEl.style.display = "none";
  }
}

function createTooltip() {
  tooltipEl = document.createElement("div");
  tooltipEl.style.position = "absolute";
  tooltipEl.style.backgroundColor = "rgba(0,0,0,0.8)";
  tooltipEl.style.color = "#fff";
  tooltipEl.style.padding = "10px";
  tooltipEl.style.borderRadius = "5px";
  tooltipEl.style.zIndex = "99999";
  tooltipEl.style.pointerEvents = "none";
  tooltipEl.style.display = "none";

  document.body.appendChild(tooltipEl);
}

function handleMouseOver(event) {
  if (!isInspectorActive) return;

  const domElement = event.target;
  const ui5ControlId = domElement.id;
  const oControl = ui5ControlId ? sap.ui.getCore().byId(ui5ControlId) : null;

  if (oControl) {
    const controlName = oControl.getMetadata().getName();
    const modelInfo = oControl.getModel() ? JSON.stringify(oControl.getModel().getData(), null, 2) : "No model data";
    const bindingContext = oControl.getBindingContext() ? oControl.getBindingContext().getPath() : "No binding context";

    tooltipEl.textContent = `
      Control: ${controlName}
      ID: ${ui5ControlId}
      Model Data: ${modelInfo}
      Binding Context: ${bindingContext}
    `;
    tooltipEl.style.display = "block";
    tooltipEl.style.left = event.pageX + 15 + "px";
    tooltipEl.style.top = event.pageY + 15 + "px";
  } else {
    tooltipEl.style.display = "none";
  }
}

function handleMouseOut() {
  if (tooltipEl) {
    tooltipEl.style.display = "none";
  }
}
