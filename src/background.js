chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request);
    if (request.action) {
      if (request.action === 'getTabs') {
        chrome.tabs.query({}, function(tabs) {
          sendResponse(tabs);
        });
      }
      if (request.action === 'genGraph') {
        chrome.tabs.query({}, function(tabs) {
          sendResponse(tabs);
        });
      }
    } 
    return true;
  });

// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//     chrome.runtime.sendMessage({ type: 'FROM_PAGE', payload: message });
// });

// 监听来自插件页面的消息，并转发给独立页面
chrome.runtime.onConnect.addListener(function(port) {
  if (port.name !== 'popup') return;
  port.onMessage.addListener(function(message) {
    console.log({ type: 'FROM_EXTENSION', payload: message })
    // port.postMessage({ type: 'FROM_EXTENSION', payload: message }, '*');
  });
});