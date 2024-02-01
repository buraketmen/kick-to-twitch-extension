"use strict";
var colorSwitcherWidget = document.querySelector("#color_switcher");

chrome.storage.local.get(["colorSwitcher"], function (result) {
  const localValue = result.colorSwitcher || false;
  colorSwitcherWidget.checked = localValue;
  setCss(localValue);
});

function runScript(tabs) {
  for (const { id } of tabs) {
    chrome.scripting
      .executeScript({
        target: { tabId: id, allFrames: true },
        func: setCss,
        args: [colorSwitcherWidget.checked],
      })
      .then(() => console.log("CSS changed!"));
  }
}

function setCss(checked) {
  const { id } = chrome.runtime;
  let el = document.getElementById(id);
  if (checked) {
    if (el == null) {
      el = document.createElement("link");
      el.id = id;
      el.rel = "stylesheet";
      el.href = chrome.runtime.getURL("override.css");
      document.head.appendChild(el);
    }
  } else {
    if (el != null) {
      el.remove();
    }
  }
}

function onError(error) {
  console.error(`Error: ${error}`);
}
// Function to save the state of the color switcher to local storage
function saveColorSwitcherState() {
  chrome.tabs.query({ url: "https://kick.com/*" }).then(runScript, onError);
  chrome.storage.local.set({
    colorSwitcher: colorSwitcherWidget.checked,
  });
}

colorSwitcherWidget.addEventListener("change", function () {
  saveColorSwitcherState();
});
