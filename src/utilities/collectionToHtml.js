import uuid from "./uuid";
import getCandidateString from "./getCandidateString";

export default v2;

function v2(array, options) {
  // returns HTML String
  // Expected collection schema:
  // [{selected: true, text: String, versions: Object}, ...]

  if (!array) return;

  const { tag, br } = options || { tag: "p", br: "<br/>" };
  const html = array.map(row => {
    let classnames = [];

    const { text = "", versions = "", selected = "" } = row;
    const id = versions ? uuid() : "";
    const value = text || (versions && getCandidateString(versions)) || "";
    const json = versions ? JSON.stringify(versions) : "";

    // derived classNames
    classnames.push(versions ? "locked" : "");
    classnames.push(selected ? "selected" : "");
    classnames.push(!value && versions ? "empty" : "");
    classnames = classnames.join(" ").trim() || null;

    const el = {};
    el.id = id ? ` id="${id}"` : "";
    el.className = classnames ? ` class="${classnames}"` : "";
    el.dataset = versions ? ` data-versions='${json}'` : "";
    el.innerHTML = value || br;

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
