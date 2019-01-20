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
    let classnames = [];

    const { text = "", versions = "", selected = "" } = row;
    const id = versions ? uuid() : "";
    const candidate = versions && getCandidateString(versions);
    const value = text || candidate || "";
    const json = versions ? JSON.stringify(versions) : "";

    const isEmpty = versions && !candidate ? true : false;
    const isInactive = re.test(value);

    // derived classNames
    classnames.push(versions ? "locked" : "");
    classnames.push(isInactive ? flag : "");
    classnames.push(unique && selected ? "selected" : "");
    classnames.push(isEmpty ? "empty" : "");
    classnames = classnames.join(" ").trim() || null;

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
