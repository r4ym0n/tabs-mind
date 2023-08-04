document.addEventListener("DOMContentLoaded", function () {
  var getTabsButton = document.getElementById("getTabsButton");
  var tabsList = document.getElementById("tabsList");

  getTabsButton.addEventListener("click", function () {
    chrome.runtime.sendMessage({ action: "getTabs" }, function (tabs) {
      console.log(tabs);
      for (var i = 0; i < tabs.length; i++) {
        var tab = tabs[i];
        var tabItem = document.createElement("li");
        tabItem.textContent = tab.title;
        tabsList.appendChild(tabItem);
      }
    });
  });

  document
    .getElementById("open-extension-page")
    .addEventListener("click", function () {
      chrome.runtime.sendMessage({ action: "genGraph" }, function (tabs) {
        chrome.tabs.create({
          url: chrome.runtime.getURL("extension-page.html"),
        });
        port.postMessage({ type: "FROM_EXTENSION", payload: tabs });
      });
    });

  document
    .getElementById("Message2Page")
    .addEventListener("click", function () {
      chrome.runtime.sendMessage({ message: "genGraph" }, function (tabs) {});
    });
  // 插件页面

  // 创建与 background script 的长连接
  const port = chrome.runtime.connect({ name: "popup" });

  // 监听来自独立页面的消息
  window.addEventListener("message", function (event) {
    if (event.source != window) return;
    if (event.data.type && event.data.type === "FROM_PAGE") {
      // 将消息发送到 background script
      port.postMessage(event.data.payload);
    }
  });

  // 监听来自 background script 的消息
  port.onMessage.addListener(function (message) {
    console.log("Message received from background script: ", message);
  });
});
