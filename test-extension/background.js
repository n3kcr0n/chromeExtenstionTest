chrome.action.onClicked.addListener(async () => {
  const width = 400;
  const height = 520;

  try {
    // Get display info (instead of using screen.*)
    const displays = await chrome.system.display.getInfo();
    const primaryDisplay = displays.find(d => d.isPrimary) || displays[0];
    const { workArea } = primaryDisplay;

    const left = Math.round(workArea.left + (workArea.width - width) / 2);
    const top = Math.round(workArea.top + (workArea.height - height) / 2);

    chrome.windows.create({
      url: chrome.runtime.getURL("login.html"),
      type: "popup",
      focused: true,
      width,
      height,
      left,
      top,
    }, (window) => {
      if (chrome.runtime.lastError) {
        console.error("Error creating centered window:", chrome.runtime.lastError);
      } else {
        console.log("✅ Centered login window created:", window);
      }
    });
  } catch (err) {
    console.error("❌ Failed to get display info:", err);
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("✅ Extension installed and background worker active");
});

