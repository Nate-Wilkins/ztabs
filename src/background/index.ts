// // // // // // // // // // // // // // // // // // // //
// @authors
// - Nate-Wilkins <nate-wilkins@code-null.com>
// - iainbeeston
// // // // // // // // // // // // // // // // // // // //

import { EntryPoints } from '../entry_points';

// // // // // Actions  // // // // // // // // // // // //
// /

/*
 * Tab detach.
 */
const tabDetach = (
  tab: chrome.tabs.Tab,
  tabType: chrome.windows.createTypeEnum,
) => {
  if (tab.url === 'chrome://newtab/' || tab.pinned) {
    return;
  }

  chrome.windows.get(tab.windowId, oldWindow => {
    chrome.windows.create({
      tabId: tab.id,
      incognito: tab.incognito,
      state: oldWindow.state,
      type: tabType,
    });
  });
};

/*
 * Chrome tabs detach all.
 */
const chromeTabsDetachAll = () => {
  chrome.tabs.query({}, tabs => {
    tabs.forEach(tab => {
      const tabType = 'popup';
      tabDetach(tab, tabType);
    });
  });
};

/*
 * Chrome windows active tab toggle window type.
 */
const chromeWindowsActiveTabToggleWindowType = () => {
  chrome.windows.getCurrent(win => {
    const windowType = win.type;
    chrome.tabs.query({ windowId: win.id }, tabs => {
      const tab = tabs.filter(tab => {
        return tab.active;
      })[0];
      const tabType = windowType === 'normal' ? 'popup' : 'normal';
      tabDetach(tab, tabType);
    });
  });
};

// \
// // // // // Actions  // // // // // // // // // // // //

// // // // // Events  // // // // // // // // // // // //
// /

/*
 * When a browser action occurs, remove any windows.
 */
chrome.action.onClicked.addListener((tab: chrome.tabs.Tab) => {
  chrome.windows.getAll(windows => {
    windows.forEach(window => {
      if (
        window.id &&
        window.id !== tab.windowId &&
        window.state !== 'minimized'
      ) {
        chrome.windows.remove(window.id);
      }
    });
  });
});

/*
 * When extension is installed, detach all tabs.
 */
chrome.runtime.onInstalled.addListener(() => {
  chromeTabsDetachAll();
});
/*
 * When extension is started, detach all tabs.
 */
chrome.runtime.onStartup.addListener(() => {
  chromeTabsDetachAll();
});

/*
 * When a tab is created, detach that tab.
 */
chrome.tabs.onCreated.addListener(() => {
  chrome.windows.getCurrent(win => {
    chrome.tabs.query({ windowId: win.id }, tabs => {
      const tab = tabs.filter(tab => {
        return tab.active;
      })[0];
      tabDetach(tab, 'popup');
    });
  });
});

/*
 * When a chrome command is executed, activate the command handler.
 */
chrome.commands.onCommand.addListener(command => {
  console.log(`[ztabs]: command '${command}'.`);
  if (command === 'toggle-popup-mode') {
    chromeWindowsActiveTabToggleWindowType();
  }
});

/*
 * When a chrome tab is updated, inject the progress bar into the page.
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!changeInfo.url) return;
  if (tab.url && tab.url.startsWith('chrome://')) return;
  console.log(`[ztabs]: injecting progress bar.`);

  chrome.scripting.executeScript({
    files: [EntryPoints.inject.output],
    target: { tabId },
  });
});

// \
// // // // // Events  // // // // // // // // // // // //
