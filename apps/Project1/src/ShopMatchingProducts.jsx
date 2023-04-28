import "./ShopMatchingProducts.style.scss";
import React from 'react';
import { productColorSelector, undefinedLink, getInternalSearchHref } from './settings'

export const ShopMatchingProducts = ({ property, text }) => {
  const [href, setHref] = React.useState(undefinedLink)
  const isActive = href !== undefinedLink;

  const handleColorChange = (mutationList, observer) => {
    if (!window.location.href.includes("/products/")) {
      return observer?.disconnect();
    }
    //Do the fun stuff here.
    return setHref(getInternalSearchHref(property));
  };

  React.useEffect(() => {
    handleColorChange();
    const targetNode = document.querySelector(productColorSelector);
    let observer = new MutationObserver(handleColorChange);
    observer.observe(targetNode, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    });
    return () => { observer.disconnect(); }
  }, [])

  return (
    <div className={`ProductMatching${isActive ? '' : '--hidden'}`}>
      <a className="ProductImgOverlay" href={href}>
        <div className="CallToAction">
          {/* i className="Icon fal fa-users"> */}
          <span className="Text">{text}</span>
        </div>
      </a>
    </div>
  );
}
