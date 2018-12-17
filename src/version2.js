import React, { Component } from "react";
import ReactDOM from "react-dom";
import SBD from "sbd";

// import styled from "styled-components";
import fontFamily from "./modules/fontFamily";
import Editor from "./modules/Editor";
import sampleTextFile from "./sampleTextFile";

import "./styles.scss";

window.RE = window.RE || {};

const uuid = (prefix = "a") => {
  const ts = new Date().valueOf().toString(36);
  const rnd = Math.floor(Math.random() * 9).toString(16);
  return `${prefix}${ts}${rnd}`;
};

const reBlankInnerText = /^\w\n$/;
const reDivTag = /^div$/i;

// const locked = {}; // a dictionary of DOM Elements
// const variants = {}; // a dictionary of raw text refs
const state = {
  settings: {
    fontFamily: "serif",
    fontSize: 20,
    paneWidth: 70
  },
  locked: {
    ID234243: {
      el: null,
      versions: null
    }
  },
  content: [{ id: null, text: "" }]
};

const tiggerDict = {
  ALTenter: e => {
    const el = window.getSelection().focusNode.parentNode;
    el.classList.add("locked");
    state.locked[el.id] = Object.assign({}, { el });

    editor(el.id);
    return false;
  }
};

function getCandidate(text, id) {
  // returns a catenated String of all the candidate sentences
  // after removing the unapproved (or ignored) text.

  state.locked[id].versions = text;

  const reIgnore = new RegExp("^([>=?!%/:].*|s*)$");

  let array = text.split("\n").map(line => line.trim().replace(reIgnore, ""));
  array = array.filter(text => text.length).join(" ");

  // edge cases ....
  array = array.replace(/^(\S+)?"\s+/, '$1"');
  array = array.replace(/\s+"(\S+)?$/, '"$1');
  //(\s+"(?:\S+)?$)/g, '"');
  return array;
}

function inflate(text) {
  // returns sentences broken into lines
  const array = SBD.sentences(text);
  return array.join("\n\n");
}

async function editor(id) {
  const io = document.getElementById("io");
  const { locked } = state;
  const el = locked[id].el;
  const text = locked[id].versions || inflate(el.innerText);

  io.focus();
  io.value = text;

  io.onkeyup = () => {
    el.innerText = getCandidate(io.value, id);
    io.focus();
  };
}

function tagNode(e) {
  // give a node an id if it doesn't have one

  const div = window.getSelection().focusNode.parentNode;

  if (!reDivTag.test(div.nodeName)) return;
  div.id = div.id || uuid();
}

function keyTriggers(e) {
  let { altKey, shiftKey, ctrlKey, keyCode, code, key } = e;

  altKey = (altKey && "ALT") || "";
  shiftKey = (shiftKey && "SHIFT") || "";
  ctrlKey = (ctrlKey && "CTRL") || "";
  key = key.trim() || code;

  const down = `${ctrlKey}${shiftKey}${altKey}${key.toLowerCase()}`;
  return tiggerDict[down] && tiggerDict[down](e);
}

function readonly(e, bool) {
  const div = window.getSelection().focusNode.parentNode;
  const arrow = /^arrow/i.test(e.code);
  return arrow ? false : state.locked[div.id];
}

window.RE.fontFamily = fontFamily;

class Article extends Component {
  constructor() {
    super();
    this.state = {
      defaultMsg: "Type your words here ....",
      plainText: null
    };
    window.RE.article = this;
  }

  parse(text) {
    const array = String(text).split("\n");
    return array.map((value, n) => <div key={n}>{value || <br />}</div>);
  }

  load(text, replace) {
    if (this.state.plainText && !replace) {
      console.error("Text already exists. Use replace=true to bypass");
      return;
    }
    this.setState({ plainText: text });
  }

  render() {
    const { defaultMsg, plainText } = this.state;
    const html = this.parse(plainText || defaultMsg);

    return (
      <div className="content">
        <article contentEditable="true">{html}</article>
      </div>
    );
  }
}

const Content = () => {
  return (
    <div className="pg">
      <Article />
      <Editor getSampleText={getSampleText} />
    </div>
  );
};

const App = () => <Content />;

const root = document.getElementById("root");
ReactDOM.render(<App />, root);

document.querySelector("article").onkeydown = e => {
  if (readonly(e)) {
    e.preventDefault();
    return false;
  }

  tagNode(e);
  return keyTriggers(e);
};

document.querySelector("article").onclick = e => {
  const { id } = e.target;
  if (id && state.locked[id]) editor(id);
};

function getSampleText(e) {
  e.preventDefault();
  window.RE.article.load(sampleTextFile);
  return false;
}
