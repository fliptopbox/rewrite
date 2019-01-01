import u from "./utilities";
import editorInit from "./editor";
import divideInit from "./divider";
import articleInit from "./article";

import "./styles.scss";

// load some text into the DOM
let $focusOn; // current node element

const local = u.storage().read();
const divider = divideInit();
const article = articleInit("#document");
const editor = editorInit("#sentences");

// Passive events from Editor changes
editor.onChange(article.update);

// Initial DOM injection
article.callback("click", reloadEditor);
article.callback("dblclick", toggleParagraph);
article.load();

// article.load("55555", "Kilroy!", [{ text: "Kilroy was here" }]);
// article.open();

setTimeout(() => {
  document.querySelector(".container").classList.remove("hidden");
  document.querySelector(".overlay").classList.add("hidden");
}, 550);

function reloadEditor(versions, el) {
  editor.load(versions);
  el && ($focusOn = el);
}

function toggleParagraph(versions, el) {
  editor.load(versions);
  $focusOn = el;
}
