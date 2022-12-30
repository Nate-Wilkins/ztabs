import styles from 'pace-js/pace-theme-default.css';
import { EntryPoints } from '../entry_points';

// When the page loads, inject the progress bar.
document.addEventListener('DOMContentLoaded', () => {
  const elementHead = document.getElementsByTagName('head')[0];
  if (!elementHead) {
    console.log(`[ztabs] Unable to attach client.`);
    return;
  }

  // Inject client.
  (() => {
    // Styles.
    // NOTE: Loading pace-js styles here because another loaded event listern
    //       would need to be added if it was done in the client.
    styles.use();

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
