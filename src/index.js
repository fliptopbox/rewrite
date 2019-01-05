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
const tts = u.tts();

// Passive events from Editor changes
editor.onChange(article.update);

// Initial DOM injection
article.callback("click", handleClick);
article.callback("dblclick", handleClick);
article.load();

// article.load("55555", "Kilroy!", [{ text: "Kilroy was here" }]);
// article.open();

setTimeout(() => {
  document.querySelector(".container").classList.remove("hidden");
  document.querySelector(".overlay").classList.add("hidden");
}, 550);

function handleClick(versions, el) {
  editor.load(versions);
  el && ($focusOn = el);

  console.log(divider.settings().width);
  if (divider.settings().width > 80) {
    divider.resize(null, 60);
  }
}

let pressTimer;
let downTime = 0;
let diff = 0;
let keyHistory = [];
const keyTime = 275;

divider.delegate("read", readSelectedCandidate);

function readSelectedCandidate() {
  console.log("read selected candidate");
  let { candidate } = editor.cache();
  candidate = u.inflate(candidate, true);
  tts.read(candidate);
}

window.onkeydown = e => {
  diff = e.timeStamp - downTime;
  downTime = e.timeStamp;
  console.log(e.code, e.key, e.keyCode, downTime, diff);
  keyHistory.push((e.key.trim() || e.code).toLowerCase());

  if (keyHistory && keyHistory.join("") === "controlspace") {
    readSelectedCandidate();
    keyHistory = [];
    return false;
  }

  pressTimer && clearTimeout(pressTimer);
  pressTimer = setTimeout(() => {
    editor.execute(e, keyHistory);
    console.log("clear key history", keyHistory, diff);
    keyHistory = [];
  }, keyTime);
};
