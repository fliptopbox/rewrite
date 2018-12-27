import defaultConfig from "./config";
import empty from "./empty";
import htmlToStringArray from "./htmlToStringArray";
import arrayToHtml from "./arrayToHtml";

import "./editor.scss";

/*

  const e = initialize($elm, {...options})

  e.onChange((candidate, versions) = console.log(candidate, versions))
  
  e.trigger("shiftaltalt", toggleCase);

  const toggleCase = el => {
    const text = el.innerText;
    const upper = text.toUpperCase() === text;
    const toggle = upper ? "toLowerCase" : "toUpperCase";
    el.innerText = text[toggle]();
  };

*/

let editor;
let config = { ...defaultConfig };

let cache = {
  candidate: null, // string
  versions: [null] // versions
};

const punctuation = [".", ":", "!", "?", `"`, ")"]
  .map(s => String("\\" + s))
  .join("|");

const re_comment_prefix = new RegExp("^[>]s?", "g");
const re_punctuation = new RegExp(`(${punctuation})$`, "g");
const re_comments = /^([\/\>\?\=\!]\s*?)/;

const triggerDictionary = {
  cleanup: cleanupBlanks,
  shiftshift: toggleComment
};

function getCandidateString(value) {
  // recieve String or Array
  // returns string
  // parse the DOM elements to simple Array
  value = value || htmlToStringArray(editor.children);

  const is_array = value && value.constructor === Array;
  const array = is_array ? value : textToArray(value);

  return [...array]
    .map(line => (re_comments.test(line) ? null : terminate(line)))
    .filter(s => s && s.length)
    .join(" ")
    .trim();
}

function terminate(text) {
  // return a closed sentnece.
  const { autoTerminate } = config;
  text = text && text.trim();

  if (!text) return;

  var is_closed = re_punctuation.test(text);
  var sufix = autoTerminate && !is_closed ? "." : "";

  return `${text}${sufix}`;
}

function textToArray(text) {
  // returns simple text Array
  // correcting for double line breaks

  return text.replace(/\n\n/gm, "\n").split(/\n/g);
}

// ["Lorem ipsum 1","Lorem ipsum 2","> Lorem ipsum 4","","Lorem ipsum 3"]

function load(value = null, options = {}) {
  if (!value) return;
  if (!editor) initialize();

  const array = value.constructor === Array ? value : textToArray(value);
  const html = arrayToHtml(array);

  config = Object.assign({}, config, options);

  editor.innerHTML = html;
  return html;
}

function toggleComment(bool) {
  var line = document.getSelection().focusNode.parentNode;
  var text = line.innerText;
  var skip = !/div/i.test(line.nodeName) || !text || !text.trim();

  if (skip) return;

  line.classList.toggle("comment");
}

function cleanupBlanks(rows) {
  [...rows].forEach((row, n) => {
    const text = (row.innerText && row.innerText.trim()) || null;
    text ? row : row.classList.remove("comment");
  });
}

function executeTriggers(e, keyTime, keyHistory) {
  const { parentNode } = window.getSelection().focusNode;
  const children = parentNode.children;

  keyHistory = keyHistory.join("").toLowerCase();

  const { cleanup } = triggerDictionary;
  const trigger =
    triggerDictionary[keyHistory] ||
    triggerDictionary[`id${keyHistory}`] ||
    empty;

  cleanup(children);
  trigger(parentNode);
  notifyChanges();
}

function bindEvents() {
  let ts = 0;
  let hist = [];

  editor.onkeyup = e => {
    const { doubleTap, resetDelay } = config;
    const diff = e.timeStamp - ts;
    const delay = diff < doubleTap;
    ts = e.timeStamp;

    hist = diff > resetDelay ? [] : hist;

    hist.push(e.key);
    hist = hist.slice(-5);

    setTimeout(() => executeTriggers(e, delay, hist), 0);
  };
}

function getVersionArray() {
  const options = { ...config };
  return htmlToStringArray(editor.children, options);
}

function notifyChanges() {
  // if the candidate is diffrent OR
  // if the version array is different
  // execute the change
  const { candidate, versions } = { ...cache };
  const { onChange } = config;

  const nextCandidate = String(getCandidateString());
  const nextVersions = [...getVersionArray()];

  // cheap checks first ...
  const a = candidate !== nextCandidate;

  const b = a || versions.length !== nextVersions.length;

  // most expensive check
  const execute =
    b || versions.sort().join("") !== nextVersions.sort().join("");

  // change detected
  if (execute) {
    cache = {
      candidate: nextCandidate,
      versions: nextVersions
    };
    onChange(nextCandidate, nextVersions);
  }
}

function addOnChange(fn) {
  config = Object.assign({}, config, { onChange: fn });
}

function trigger(key, callback) {
  const id = triggerDictionary[key] ? `id${key}` : key;
  triggerDictionary[id] = callback;
  console.log("added trigger [%s]", id, key);
}

function initialize(selector = null, options) {
  config.selector = config.selector || selector;
  editor = document.querySelector(config.selector);

  if (!editor) {
    throw `module requires DOM element [${selector}]`;
  }

  if (options) {
    config = Object.assign({}, config, options);
  }

  bindEvents();
  return {
    load,
    trigger,
    settings: () => config,
    onChange: addOnChange,
    candidate: getCandidateString,
    versions: htmlToStringArray
  };
}

export default initialize;
