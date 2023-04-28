import "./styles.scss";
import { waitForElementRAF } from "adumbrate";
import { ShopMatchingProducts } from "./ShopMatchingProducts";
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
  class ReactComponent {
    constructor(
      component,
      options = {
        //beforebegin, afterbegin, beforeend, afterend.
        position: "beforeend",
        selector: "body",
        identifier: "",
        allowDuplicates: false,
      }
    ) {
      this.component = component;

      this.identifier =
        "react-wrapper-UUID" + (options?.identifier ? `-${options.identifier}` : "");
      this.wrapper = {
        position: options?.position || "beforeend",
        selector: options?.selector || "body",
        htmlString: `<div id="${this.identifier}"></div>`,
        allowDuplicates: options?.allowDuplicates || false,
      };
    }
    render = () => {
      if (this.inject(this.wrapper)) {
        try {
          const domContainer = document.getElementById(this.identifier);
          if (domContainer == null) return;
          const root = ReactDOM.createRoot(domContainer);
          root.render(this.component);
        } catch (e) {
          console.error("Root failed to render", e.message);
        }
      }
    };
    remove = () => {
      try {
        const domContainer = document.getElementById(this.identifier);
        if (domContainer == null) return;
        domContainer.remove();
      } catch (e) {
        console.error("Root failed to remove", e.message);
      }
    };
    inject = ({ selector, position, htmlString, allowDuplicates }) => {
      let target = document.querySelector(selector);
      if (!target) return false;
      let isDuplicate = document.querySelector(`#${this.identifier}`);
      if (isDuplicate && !allowDuplicates) return false;
      target.insertAdjacentHTML(position, htmlString);
      return true;
    };
  }

  const getComponentProps = () => {
    if (["top"].some((substring) => window.location.href.includes(substring))) {
      return {
        key: "forBottoms",
        text: "Shop Matching Swim Bottoms",
      };
    }
    if (["bottom", "shorts"].some((substring) => window.location.href.includes(substring))) {
      return {
        key: "forTops",
        text: "Shop Matching Swim Tops",
      };
    }
    return {};
  };

  const props = getComponentProps();

  const desktopComponent = new ReactComponent(
    <ShopMatchingProducts property={props.key} text={props.text} />,
    {
      identifier: "desktop",
      position: "afterend",
      selector: "image-viewer-desktop",
    }
  );

  const mobileComponent = new ReactComponent(
    <ShopMatchingProducts property={props.key} text={props.text} />,
    {
      identifier: "mobile",
      position: "afterend",
      selector: "image-gallery-mobile",
    }
  );

  // const onViewportResize = () => {
  //   console.debug("onViewportResize");
  // };

  window.pnt[UUID].main = async function () {
    try {
      let isLoaded = await waitForElementRAF(pageSync.selector);
      if (!isLoaded)
        throw new Error("waitForElementRAF() - Selector not found:", pageSync.selector);

      if (props === {}) return;

      if (le.digitalData.page.pageType !== "PRODUCT") return; //window.removeEventListener("resize", onViewportResize);

      // desktopComponent.remove();
      // mobileComponent.remove();

      desktopComponent.render();
      mobileComponent.render();

      // onViewportResize();
      // window.addEventListener("resize", onViewportResize);
    } catch (e) {
      console.error(e.message);
    }
  };
  window.pnt[UUID].main();
}
