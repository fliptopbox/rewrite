"use strict";

let data = null;
const options = {
  re: {
    commentChars: /^(\s+)?[>?!/]+(\s+)?/
  }
};

function candidate() {
  const data = this.el;

  const { commentChars } = options.re;
  const text = plainText(data);
  const { dataset } = data || {};
  const { versions = null } = dataset || {};
  const array = getJsonArray(versions);
  const catenated =
    array && [...array].filter(s => !commentChars.test(s)).join(" ");
  return catenated || text || undefined;
}

function versions(array) {
  const data = this.el;
  const text = plainText(data);
  const singleton = text && [text];
  const { dataset } = data || {};
  const { versions } = dataset || {};

  if (Array.isArray(array)) {
    // update the DOM element data & innerText
    data.dataset.versions = JSON.stringify(array);
    data.innerHTML = candidate();
  }

  if (!text && !versions) return;

  return getJsonArray(versions) || singleton;
}

function plainText(inner) {

  if (!inner) return null;
  const { innerHTML, innerText, textContent } = inner;
  const text = innerText || innerHTML || textContent || "";
  return text.trim();
}

function getJsonArray(string) {
  string = `${string}`;
  string = string.replace(/^(undefined|null)/i, "");

  if (!string) return null;

  const object = JSON.parse(string);
  return object;
}

class selected {
  constructor(obj, opt = {}) {
    // augment the local options & obj (Element)
    // opt && Object.assign(options, opt);

    // this.options = Object.assign({}, options, opt);
    // this.el = obj;
    Object.assign(this, { el: obj }, opt);

    this.options = { ...options };
    this.candidate = candidate.bind(this);
    this.versions = versions.bind(this);

    // this.node = opt;
    // data = obj && Object.assign(obj, { candidate, versions });
    // return data;
  }
}

export default selected;
