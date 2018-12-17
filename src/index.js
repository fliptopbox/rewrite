import React, { Component } from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers } from "redux";

// helper functions and modules
import u from "./utilities/";
import initialState from "./modules/initialState";
import fontFamily from "./modules/fontFamily";

// React components
import Editor from "./modules/Editor";
import allReducers from "./modules/allReducers";

import "./styles.scss";

window.RE = window.RE || {};

const localState = u.storage();
const state = localState.read() || initialState;
localState.write(state);

const store = createStore(combineReducers(allReducers), state);

function tagNode(e) {
  // give a node an id if it doesn't have one

  const div = window.getSelection().focusNode.parentNode;

  if (!/^div$/i.test(div.nodeName)) return;
  div.id = div.id || u.uuid();
}

const tiggerDict = {
  ALTenter: e => {
    const el = window.getSelection().focusNode.parentNode;
    const { id } = el;

    el.classList.add("locked");

    const text = u.inflate(el.innerText);

    store.dispatch({ type: "CONTENT-LOCK", id: id });
    store.dispatch({ type: "EDITOR-LOAD", id: id, text: text });

    return false;
  }
};

function keyTriggers(e) {
  let { altKey, shiftKey, ctrlKey, code, key } = e;

  altKey = (altKey && "ALT") || "";
  shiftKey = (shiftKey && "SHIFT") || "";
  ctrlKey = (ctrlKey && "CTRL") || "";
  key = key.trim() || code;

  const down = `${ctrlKey}${shiftKey}${altKey}${key.toLowerCase()}`;
  return tiggerDict[down] && tiggerDict[down](e);
}

function readonly(e) {
  const div = window.getSelection().focusNode.parentNode;
  const arrow = /^arrow/i.test(e.code);
  const { content } = store.getState();
  return arrow ? false : content[div.id];
}

window.RE.fontFamily = fontFamily;

class Article extends Component {
  constructor() {
    super();
    this.state = {
      defaultMsg: [{ key: 0, value: "Type your words here ...." }],
      collection: []
    };
    window.RE.article = this;
  }

  textToCollection(text) {
    const paras = text.split("\n");
    return paras.map((value, n) => ({
      key: n,
      text: value,
      id: value && value.trim() ? u.uuid() : undefined
    }));
  }

  load(text, replace) {
    // if (this.state.plainText && !replace) {
    //   console.error("Text already exists. Use replace=true to bypass");
    //   return;
    // }
    const array = this.textToCollection(text);
    this.setState({ collection: array });
  }

  render() {
    const { defaultMsg, collection } = this.state;
    const array = collection.length === 0 ? defaultMsg : collection;

    const html = array.map(row => {
      const { id, key, text } = row;
      return (
        <div id={id} key={key}>
          {text || <br />}
        </div>
      );
    });

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
      <Editor store={store} />
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

function updateIO(value = null) {
  const el = document.getElementById("io");
  el.value = value;
  el.focus();
}

document.querySelector("article").onclick = e => {
  const { id } = e.target;
  const { editor } = store.getState();

  // if (id && state.locked[id]) editor(id);
  if (editor[id]) {
    store.dispatch({ type: "EDITOR-LOAD", id: id, text: null });
    updateIO(editor[id]);
  }
};

document.querySelector("article").ondblclick = e => {
  const el = e.target;
  el.id = el.id || u.uuid();

  const { id } = el;
  const { editor } = store.getState();

  if (editor[id] && window.confirm("Are you sure?")) {
    store.dispatch({ type: "EDITOR-DELETE", id: id });
    store.dispatch({ type: "CONTENT-UNLOCK", id: id });
    el.classList.remove("locked");
    console.log(3, "render the candidate", store.getState());
    updateIO();
    return;
  }

  if (!editor[id]) {
    store.dispatch({
      type: "EDITOR-LOAD",
      id: id,
      text: u.inflate(el.innerText)
    });
    store.dispatch({ type: "CONTENT-LOCK", id: id });
    el.classList.add("locked");

    console.log(3, "lock the element", store.getState());
    updateIO(editor[id]);
    return;
  }
};
