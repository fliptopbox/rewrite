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
  u.focusOn(el, "focus");

  if (divider.settings().width > 80) {
    divider.resize(null, 60);
  }
}

let context = 0;
const contexts = ["article", "editor"];

let diff = 0;
let pressTimer;
let downTime = 0;
let keyHistory = [];
const keyTime = 350;

divider.delegate("read", readSelectedCandidate);

function readSelectedCandidate() {}

let $container;
function changeContext(index = null) {
  context = typeof index === "number" ? index : (context + 1) % contexts.length;
  const current = contexts[context];
  const id = ["document", "sentences"];

  const focus = id[context];
  let $el;

  switch (focus) {
    case "document":
      $el = document.querySelector(".selected");
      break;
    case "sentences":
      $el = document.querySelector(".current");
      break;
  }
  // const $el = document.getElementById(id[context]).focus();

  setTimeout(() => {
    $container = $container || document.querySelector(".container");
    $container.setAttribute("focus", current);
    $el.focus();
    console.log("context", context, $el);
  }, 0);

  return context;
}

window.changeContext = changeContext;
changeContext(0);

const triggerDict = {
  tab: {
    global: changeContext
  },
  controlspace: {
    global: e => {
      let { candidate } = editor.cache();
      candidate = u.inflate(candidate, true);
      tts.read(candidate);
    }
  },
  shiftshiftl: {
    article: e => {
      const el = window.getSelection().focusNode;
      article.toggle(el);
      changeContext(1);
    }
  },

  shiftshift: {
    editor: (e, array) => {
      return editor.execute(e, array);
    }
  }
};

function executeKeyTriggers(e) {
  diff = e.timeStamp - downTime;
  downTime = e.timeStamp;
  keyHistory.push(e.key.trim() || e.code);

  const ns = contexts[context];
  const key = keyHistory.join("").toLowerCase();
  const triggerKey = triggerDict[key];

  console.log("exec triggers", ns, context);

  // trigger can be context sensitive OR global
  const triggerGlobal = triggerKey && triggerKey.global;
  const callback = triggerGlobal || (triggerKey && triggerKey[ns]) || null;

  pressTimer && clearTimeout(pressTimer);
  pressTimer = setTimeout(() => {
    console.log("clear history", keyHistory);
    keyHistory = [];
  }, keyTime);

  if (callback) {
    e.preventDefault();
    e.stopPropagation();
    return callback(e, keyHistory);
  }
}

window.onkeydown = executeKeyTriggers;
