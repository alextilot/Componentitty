import "./styles.css";
import { App } from "./component";

("use strict");
if (window.pnt == null) {
  window.pnt = {};
}

if (window.pnt[uid] == null) {
  window.pnt[uid] = {};
  const pageSync = {
    selector: "#visual-navigation",
  };
  const component = {
    wrapper: {
      selector: "visual-nav",
      // selector: "body",
      //beforebegin, afterbegin, beforeend, afterend.
      position: "afterbegin",
      // position: "beforeend",
      allowDuplicates: false,
      identifier: "react-wrapper-uid",
      htmlString: '<div id="react-wrapper-uid"></div>',
    },
    render: function () {
      if (this.inject(this.wrapper)) {
        try {
          const domContainer = document.getElementById(this.wrapper.identifier);
          if (domContainer == null) return;
          const root = ReactDOM.createRoot(domContainer);
          root.render(<App />);
        } catch (e) {
          console.error("Root Failed to render", e.message);
        }
      }
    },
    inject: function ({ selector, position, identifier, htmlString, allowDuplicates }) {
      let target = document.querySelector(selector);
      let isDuplicate = allowDuplicates && document.getElementById(identifier);
      if (isDuplicate || !target) return false;

      target.insertAdjacentHTML(position, htmlString);
      return true;
    },
  };
  async function waitLoop(startTimeInMs, timeoutInMs, callback) {
    return await new Promise(async (resolve, reject) => {
      while (!callback()) {
        if (Date.now() - startTimeInMs > timeoutInMs) reject(new Error("P&T: Timed Out"));
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
    if (typeof timeoutInMs !== "number") throw new Error("timeoutInMs is not a number");
    if (timeoutInMs < 0) throw new Error("timeoutInMs is equal to or less then 0");

    let startTimeInMs = Date.now();
    await waitLoop(startTimeInMs, timeoutInMs, () => {
      return document.querySelector(selector) != null;
    });

    return document.querySelector(selector);
  }

  async function waitForVariable(
    variableString,
    config = {
      parent: window,
      expectedValue: null,
      expectedType: "",
      timeoutInMs: 10000,
    }
  ) {
    const options = {
      parent: typeof config.parent == "undefined" ? window : config.parent,
      expectedValue: typeof config.expectedValue == "undefined" ? null : config.expectedValue,
      expectedType: typeof config.expectedType == "undefined" ? "" : config.expectedType,
      timeoutInMs: typeof config.timeoutInMs == "undefined" ? 10000 : config.timeoutInMs,
    };

    if (typeof variableString !== "string")
      throw new Error(`variableString: '${variableString}' -  is not type string`);
    let stringArray = variableString.split(".");
    if (stringArray.length === 0) throw new Error("variableString is invalid");

    var startTimeInMs = Date.now();

    function isObjectEmpty(value) {
      return (
        Object.prototype.toString.call(value) === "[object Object]" &&
        JSON.stringify(value) === "{}"
      );
    }
    function evaluate(parent, property) {
      let value = parent[property];
      let valueEnabled = options.expectedValue !== null;
      let valueBoolean = options.expectedValue === value;

      let typeEnabled = options.expectedType !== "";
      let typeBoolean = options.expectedType === typeof value;

      if (valueEnabled && typeEnabled) {
        return valueBoolean && typeBoolean;
      }
      if (valueEnabled && !typeEnabled) {
        return valueBoolean;
      }
      if (!valueEnabled && typeEnabled) {
        return typeBoolean;
      }
      //!valueEnabled && !typeEnabled
      if (typeof value != "undefined" && value != null) {
        return true;
      }
      return false;
    }

    async function recursion(parent, stringArray) {
      let property = null;
      if (stringArray.length == 1) {
        await waitLoop(startTimeInMs, options.timeoutInMs, () => {
          return evaluate(parent, stringArray[0]);
        });
        return parent[stringArray[0]];
      }
      property = stringArray.shift();
      await waitLoop(startTimeInMs, options.timeoutInMs, () => {
        return !isObjectEmpty(parent[property]) && parent.hasOwnProperty(property);
      });
      return recursion(parent[property], stringArray);
    }

    return await recursion(options.parent, stringArray);
  }

  window.pnt[uid].main = async function () {
    try {
      var externalScript = await waitForVariable("React");
      if (!externalScript)
        throw new Error("waitForVariable() - External Script not found: ", "React");
      var isLoaded = await waitForElementRAF(pageSync.selector);
      if (!isLoaded)
        throw new Error("waitForElementRAF() - Selector not found:", pageSync.selector);
      component.render();
    } catch (e) {
      console.error(e.message);
    }
  };
  window.pnt[uid].main();
}
