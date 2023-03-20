// import App from './component.jsx'

'use strict';
if (window.pnt == null) {
  window.pnt = {};
}

if (window.pnt[uid] == null) {
  window.pnt[uid] = {};
  const pageSync = {
    selector: '',
  };
  const component = {
    wrapper: {
      selector: 'body',
      //beforebegin, afterbegin, beforeend, afterend.
      position: 'beforeend',
      allowDuplicates: false,
      identifier: '#react-wrapper-[uid]',
      htmlString: '<div id="react-wrapper-[uid]"></div>',
    },
    element: App,
    render: () => {
      if (inject(this.wrapper)) {
        const domContainer = document.querySelector(this.wrapper.selector);
        const root = ReactDOM.createRoot(domContainer);
        root.render(this.element);
      }
    },
    inject: ({ selector, position, identifier, htmlString, allowDuplicates }) => {
      let target = document.querySelector(selector);
      let isDuplicate = allowDuplicates && document.querySelector(identifier);
      if (isDuplicate || !target) return false;

      target.insertAdjacentHTML(position, htmlString);
      return true;
    },
  };
  async function waitForElementMO(selector) {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver((mutations) => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector));
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }
  async function waitLoop(startTimeInMs, timeoutInMs, callback) {
    return await new Promise(async (resolve, reject) => {
      while (!callback()) {
        if (Date.now() - startTimeInMs > timeoutInMs) reject(new Error('P&T: Timed Out'));
        await new Promise((resolve, reject) => {
          requestAnimationFrame(resolve);
        });
      }
      resolve();
    });
  }
  /**
   * Checks and waits for an html element to display. Returns a promise with the first element found.
   * @param {Selector} selector HTML query selector
   * @param {Number} timeoutInMs Default is 10000 or 10 seconds
   * @param {ReturnType} Promise First element found
   */
  async function waitForElementRAF(selector, timeoutInMs = 10000) {
    if (typeof timeoutInMs !== 'number') throw new Error('timeoutInMs is not a number');
    if (timeoutInMs < 0) throw new Error('timeoutInMs is equal to or less then 0');

    let startTimeInMs = Date.now();
    await waitLoop(startTimeInMs, timeoutInMs, () => {
      return document.querySelector(selector) != null;
    });

    return document.querySelector(selector);
  }
  window.pnt[uid].main = async function () {
    try {
      var isLoaded = await waitForElementRAF(pageSync.selector);
      if (!isLoaded)
        throw new Error('waitForElementRAF() - Selector not found:', pageSync.selector);
      component.render();
    } catch (e) {
      console.error(e.message);
    }
  };
  window.pnt[uid].main();
}
