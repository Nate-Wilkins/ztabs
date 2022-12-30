import { EntryPoints } from '../entry_points';

// When the page loads, inject the progress bar.
document.addEventListener('DOMContentLoaded', () => {
  const elementHead = document.getElementsByTagName('head')[0];
  if (!elementHead) {
    console.log(`[ztabs] Unable to attach progress bar.`);
    return;
  }

  // Inject Pace.
  (() => {
    // StyleSheet.
    const elementStylePace = document.createElement('style');
    elementStylePace.innerHTML =
      '\n' +
      '/*!\n' +
      ' * pace.js v1.2.4 | Default theme\n' +
      ' * https://github.com/CodeByZach/pace/\n' +
      ' * Licensed MIT © HubSpot, Inc.\n' +
      ' */\n' +
      '.pace{-webkit-pointer-events:none;pointer-events:none;-webkit-user-select:none;-moz-user-select:none;user-select:none}.pace-inactive{display:none}.pace .pace-progress{background:#d72630;position:fixed;z-index:2000;top:0;right:100%;width:100%;height:2px}A\n' +
      '';
    elementHead.prepend(elementStylePace);

    // Script.
    const elementScriptPace = document.createElement('script');
    elementScriptPace.setAttribute('data-pace-options', '{ "ajax": true }');
    elementScriptPace.setAttribute('type', 'text/javascript');
    elementScriptPace.setAttribute(
      'src',
      chrome.runtime.getURL(EntryPoints.client.output),
    );
    elementHead.prepend(elementScriptPace);
  })();
});
