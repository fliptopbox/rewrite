import uuid from "../utilities/uuid";
import getCandidateString from "./getCandidateString";

function collectionToHtml(array) {
  // returns HTML String
  // Expected collection schema:
  // [{text: String, versions: Object}, ...]

  if (!array) return;

  const html = array.map(row => {
    const { text = "", versions = "" } = row;

    const id = versions ? uuid() : "";
    const classname = (versions && "locked") || "";
    const value = text || (versions && getCandidateString(versions)) || "";
    const json = versions ? JSON.stringify(versions) : "";

    // create DOM element to ensure json is parsed correctly
    // when we use it as data-version String
    const div = document.createElement("div");

    // only render relavant attributes
    id && (div.id = id);
    classname && (div.className = classname);
    versions && (div.dataset.versions = json);

    div.innerHTML = value || "<br/>";

    return div.outerHTML;
  });

  if (!/<br\s?\/?>/i.test(html.slice(-1))) {
    html.push("<div><br/></div>");
  }

  return html.join("\n");
}

export default collectionToHtml;
