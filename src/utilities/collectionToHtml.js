import uuid from "./uuid";
import getCandidateString from "./getCandidateString";

import config from "../config";
export default v2;

function v2(array, options) {
  // returns HTML String
  // Expected collection schema:
  // [{selected: true, text: String, versions: Object}, ...]

  if (!array) return;

  const { tag, br, re, flag } = { ...config.options, options };
  let unique = true; // ensure only one selected DOM element

  const html = array.map(row => {
    let classnames = {};

    const exclude = /^(text|versions|locked|selected)/i;
    const { text = "", versions = "", selected = "" } = row;
    const id = versions ? uuid() : "";
    const candidate = versions && getCandidateString(versions);
    const value = text || candidate || "";
    const json = versions ? JSON.stringify(versions) : "";

    const isEmpty = versions && !candidate ? true : false;
    const isInactive = re.test(value) || row.inactive;

    // derived classNames
    classnames.locked = versions ? true : null;
    classnames[flag] = isInactive ? true : null;
    classnames.selected = unique && selected ? true : null;
    classnames.empty = isEmpty ? true : null;

    // only add non-existant keys
    Object.keys(row).forEach(key => {
      if (exclude.test(key) || key in classnames) return;
      classnames[key] = true;
    });

    // flattern keys into string
    classnames =
      Object.keys(classnames)
        .map(key => (classnames[key] ? key : ""))
        .join(" ")
        .trim() || null;

    // ensure the "selected" element is unique
    unique = selected ? false : unique;

    const el = {};
    el.id = id ? ` id="${id}"` : "";
    el.className = classnames ? ` class="${classnames}"` : "";
    el.dataset = versions ? ` data-versions='${json}'` : "";
    el.innerHTML = value.replace(re, "") || br;

    return `<${tag}${el.id}${el.className}${el.dataset}>${
      el.innerHTML
    }</${tag}>`;
    // return el.outerHTML;
  });

  // ensure there is always an extra last line
  if (!/<br\s?\/?>/i.test(html.slice(-1))) {
    html.push(`<${tag}>${br}</${tag}>`);
  }

  return html.join("\n");
}
