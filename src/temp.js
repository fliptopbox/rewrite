"use strict";

let data = null;
const options = {
  re: {
    commentChars: /^(\s+)?[>?!/]+(\s+)?/
  }
};

const methods = {
  versions: () => {
    const text = plainText(data);
    const array = (text && [text]) || "";
    const { dataset = null } = data;
    const result =
      dataset && dataset.versions ? JSON.parse(dataset.versions) : array;
    console.log(4, dataset, text, result);
    return result;
  },

  candidate: () => {
    const { commentChars } = options.re;
    const text = plainText(data);
    const { dataset } = data;
    const { versions } = dataset || {};

    const array = versions && JSON.parse(versions);
    const catenated =
      array && array.filter(s => !commentChars.test(s)).join(" ");

    return versions ? catenated : text;
  },

  destroy: () => {
    data = null;
  }
};

function plainText(inner) {
  const { innerHTML, innerText, textContent } = inner;
  return String(innerText || innerHTML || textContent || "").trim();
}

function selected(obj, opt) {
  // augment the local options
  if (opt) Object.assign(options, opt);

  if (obj) {
    // create the DOM object.
    // Object.assign(this, methods, obj);
    // data = { ...this, ...methods, ...obj };

    data = { ...methods, ...obj };
  }

  if (obj === undefined) {
    return data;
  }

  if (obj === null) {
    data = null;
  }

  return data;
}

plainText({ innerHTML: "Alpha." }); //?
plainText({ innerText: "Alpha." }); //?
plainText({ innerHTML: "Alpha.", innerText: "Beta." }); //?

export default selected;
