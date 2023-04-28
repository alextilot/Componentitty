import "./styles.scss";
import { App } from "./component";
import { waitForElementRAF } from "adumbrate";
import ReactDOM from "react-dom";

("use strict");
if (window.pnt == null) {
  window.pnt = {};
}

if (window.pnt[UUID] == null) {
  window.pnt[UUID] = {};
  const pageSync = {
    selector: "#page-load-marker",
  };
  const component = {
    wrapper: {
      selector: "product-detail product-price price-item",
      //beforebegin, afterbegin, beforeend, afterend.
      position: "afterend",
      identifier: "react-wrapper-UUID",
      htmlString: '<div id="react-wrapper-UUID"></div>',
      allowDuplicates: false,
    },
    render: function () {
      if (this.inject(this.wrapper)) {
        try {
          const domContainer = document.getElementById(this.wrapper.identifier);
          if (domContainer == null) return;
          const root = ReactDOM.createRoot(domContainer);
          root.render(<ClickToApplyButton />);
        } catch (e) {
          console.error("Root Failed to render", e.message);
        }
      }
    },
    inject: function ({ selector, position, identifier, htmlString, allowDuplicates }) {
      let target = document.querySelector(selector);
      if (!target) return false;
      let isDuplicate = document.querySelector(`#${identifier}`);
      if (isDuplicate && !allowDuplicates) return false;
      target.insertAdjacentHTML(position, htmlString);
      return true;
    },
  };

  window.pnt[UUID].main = async function () {
    try {
      var isLoaded = await waitForElementRAF(pageSync.selector);
      if (!isLoaded)
        throw new Error("waitForElementRAF() - Selector not found:", pageSync.selector);
      component.render();
    } catch (e) {
      console.error(e.message);
    }
  };
  window.pnt[UUID].main();
}
