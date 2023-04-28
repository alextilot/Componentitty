const ColorMapping = [[]];
const InternalSearchConfig = {
  forBottoms: {
    searchContext: "S-xfh-xez-y5c-xhe-xec",
    cmreValue: "lec-_-wms-swim-_-pdp-_-matching-swim-bottoms-_-20230424-_-cta",
  },
  forTops: {
    searchContext: "S-xfh-xez-y5c-xhd-xec",
    cmreValue: "lec-_-wms-swim-_-pdp-_-matching-swim-tops-_-20230424-_-cta",
  },
};

export const productColorSelector =
  "product-detail product-colors span.attribute-title span.attribute-message span.attribute-value";
export const undefinedLink = "javascript:void(0);";

class ColorMatching {
  static get currentColor() {
    const colorElement = document.querySelector(productColorSelector);
    if (colorElement == null) return "";
    return colorElement.innerHTML;
  }
  static parentIndexOfString(arrayOfArrays, string) {
    for (let i = 0; i < arrayOfArrays.length; i++) {
      for (let j = 0; j < arrayOfArrays[i].length; j++) {
        if (arrayOfArrays[i][j].toLowerCase() == string.toLowerCase()) {
          return i;
        }
      }
    }
    return -1;
  }
  static matchingColors(arrayOfArrays, string) {
    const parentIndex = this.parentIndexOfString(arrayOfArrays, string);
    if (parentIndex == -1) return "";
    return arrayOfArrays[parentIndex].join(" ");
  }
}

const generateSearch = (property, ...args) => {
  let internalSearchUrl = new URL(
    `/search/${InternalSearchConfig[property].searchContext}?q=${args.join(` `)}`,
    window.location.origin
  );
  if (
    InternalSearchConfig[property].cmreValue !== null &&
    InternalSearchConfig[property].cmreValue !== ""
  ) {
    internalSearchUrl.searchParams.append(`cm_re`, InternalSearchConfig[property].cmreValue);
  }
  return internalSearchUrl.href;
};

export const getInternalSearchHref = (property) => {
  const currentColor = ColorMatching.currentColor;
  if (currentColor == "") return undefinedLink;
  //Would contain its own color in the list.
  const searchFilters = ColorMatching.matchingColors(ColorMapping, currentColor);
  //If no match, use the current Color.
  if (searchFilters == "") {
    return generateSearch(property, currentColor);
  } else {
    return generateSearch(property, searchFilters);
  }
};
