import 'babel-polyfill';

// Used to load external polyfills
import loadJS from 'fg-loadjs';
// Mounts the app only after we are done polyfilling
import mount from './mount';

// Webpack manifest
if (process.env.NODE_ENV === 'production') {
  // window.webpackManifest = JSON.parse(document.getElementById('manifest').innerHTML);
}

// The following should resolve immediatelly in modern browsers
Promise.all([
  // Really-old browsers that need to be taken by the hand
  // This requires HTTP request out of our control
  new Promise((resolve) => {
    if (
         'requestAnimationFrame' in window
      && 'classList' in HTMLElement.prototype
    ) {
      resolve();
    } else {
      loadJS('https://cdn.polyfill.io/v2/polyfill.min.js?flags=gated&features=requestAnimationFrame,Element.prototype.classList', resolve); // eslint-disable-line
    }
  }),
  // Fetch polyfill
  'fetch' in window ? Promise.resolve() : import('whatwg-fetch'),
]).then(mount);
