document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggleInspector");

  toggleBtn.addEventListener("click", () => {
    // 현재 활성 탭에서 메시지를 보냄
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        // Content Script로 메시지 전송
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "TOGGLE_INSPECTOR" },
          (response) => {
            // 메시지 전송 후 응답 처리
            if (chrome.runtime.lastError) {
              console.error("Error sending message:", chrome.runtime.lastError.message);
            } else {
              console.log("Response from content script:", response);
            }
          }
        );
      } else {
        console.error("No active tabs found.");
      }
    });
  });
});
