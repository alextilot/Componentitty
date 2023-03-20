'use strict';
if (window.pnt == null) {
  window.pnt = {};
}

if (window.pnt[uid] == null) {
  window.pnt[uid] = {};
  const loadScript = (url, async = false, type = 'text/javascript') => {
    return new Promise((resolve, reject) => {
      try {
        const scriptEle = document.createElement('script');
        scriptEle.type = type;
        scriptEle.async = async;
        scriptEle.src = url;
        scriptEle.setAttribute('defer', false);
        scriptEle.setAttribute('crossorigin', '');

        scriptEle.addEventListener('load', (ev) => {
          resolve({ status: true });
        });

        scriptEle.addEventListener('error', (ev) => {
          reject({
            status: false,
            message: `Failed to load the script ${url}`,
          });
        });

        document.body.appendChild(scriptEle);
      } catch (error) {
        reject(error);
      }
    });
  };
  window.pnt[uid].main = async function () {
    try {
      await Promise.all([
        loadScript('https://unpkg.com/react@18/umd/react.production.min.js'),
        loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js'),
      ]);
    } catch (e) {
      console.error(e.message);
    }
  };
  window.pnt[uid].main();
}
