import defaultConfig from "./config";
import empty from "./empty";
import htmlToStringArray from "./htmlToStringArray";
import textToArray from "./textToArray";
import getCandidateString from "./getCandidateString";
import arrayToHtml from "./arrayToHtml";
import wordcount from "../utilities/wordcount";

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

// const re_comment_prefix = new RegExp("^[>]s?", "g");
const re_punctuation = /(\.|\:|\!|\?|\"|\))$/g;
const re_comments = /^([\/\>\?\=\!]\s*?)/;
console.log(re_punctuation);

const triggerDictionary = {
  cleanup: cleanupBlanks,
  shiftshift: toggleComment,
  controlt: toggleComment
};

// ["Lorem ipsum 1","Lorem ipsum 2","> Lorem ipsum 4","","Lorem ipsum 3"]
function clearVersions() {
  editor.innerHTML = "";
  editor = null;
  cache.candidate = null;
  cache.versions = [null];
  // issue onClose event
}

function setWordcount(row) {
  if (!row || !row.innerText) return;
  const words = wordcount(row.innerText);
  row.dataset.wordcount = words;
}

function updateWordCountDataset() {
  if (config.showWordCount) {
    [...editor.children].map(setWordcount);
  }
}

function load(value = null, options = {}) {
  if (!value) {
    editor.innerHTML = "";
    return;
  }
  if (!editor) initialize();

  const array = value.constructor === Array ? value : textToArray(value);
  const html = arrayToHtml(array);

  config = Object.assign({}, config, options);

  editor.innerHTML = html;
  editor.focus();

  updateWordCountDataset();
  notifyChanges();
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

function executeTriggers(e, keyHistory) {
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
  setWordcount(parentNode);
  notifyChanges();
}

function bindEvents() {
  let ts = 0;
  let hist = [];

  editor.ondblclick = e => {
    hist = ["shift", "shift"];
    return executeTriggers(e, hist);
  };

  // editor.onkeyup = e => {
  //   const { doubleTap, resetDelay } = config;
  //   const diff = e.timeStamp - ts;
  //   const delay = diff < doubleTap;
  //   ts = e.timeStamp;

  //   hist = diff > resetDelay ? [] : hist;

  //   hist.push(e.key);
  //   hist = hist.slice(-5);

  //   setTimeout(() => executeTriggers(e, delay, hist), 0);
  // };
}

function getVersionArray() {
  const options = { ...config };
  return htmlToStringArray(editor.children, options);
}

function notifyChanges() {
  // if the candidate is diffrent OR
  // if the version array is different
  // execute the change
  const { children } = editor;
  const { candidate, versions } = { ...cache };
  const { onChange } = config;
  const string = htmlToStringArray(children);

  const nextCandidate = String(getCandidateString(string));
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
  const methods = {
    load,
    trigger,
    execute: executeTriggers,
    clear: clearVersions,
    settings: () => config,
    onChange: addOnChange,
    candidate: getCandidateString,
    versions: htmlToStringArray
  };
  window.RE = window.RE || {};
  window.RE.editor = methods;
  return methods;
}

export default initialize;
