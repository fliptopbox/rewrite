import React, { Component } from "react";

import stateMonitor from "./stateMonitor";
import u from "../utilities";
import getCandidate from "./extractCandidateText";
import Resizer from "./Resizer";
import Footer from "./Footer";

let store;

// const handleBlur = e => {
//   console.log("blur", $parent);
//   document.querySelector(".selected").classList.remove("selected");
// };

const plainTextToHtml = (string = "") => {
  return string
    .split("\n")
    .map(text => ["<div>", text.trim() || "<br />", "</div>"].join(""))
    .join("\n");
};

class Editor extends Component {
  constructor(props) {
    super();
    store = props.store;
    this.parent = null;
    this.state = {
      current: null,
      value: null
    };

    const watchEditor = stateMonitor(store.getState, "editor.current");
    const announceEditor = current => {
      let obj = Object.assign({}, store.getState().editor);
      let { value } = obj;
      value = plainTextToHtml(value);
      obj.value = value;

      console.log(1, value);

      this.setState({ ...obj });
      this.select(current);
      this.history = [];
      this.ts = 0;
      this.re_comments = /^([/>?=!]\s*?)/;
    };
    store.subscribe(() => watchEditor(announceEditor));
  }

  select = current => {
    const prev = document.querySelectorAll(".selected");
    [...prev].forEach(el => el.classList.remove("selected"));

    this.parent = document.getElementById(current);
    if (!current || !this.parent) {
      console.log("EDITOR RESET");
      this.setState({ current: null, value: null });
      return;
    }

    const value = this.parent.innerText;
    this.parent.setAttribute("data-word-count", value.split(" ").length);
    this.parent.classList.add("selected");
  };

  execTrigger = (ms, pattern, value) => {
    // console.log(ms, pattern, value)
    switch (pattern.toLowerCase()) {
      case "shiftshift":
        this.toggleComment();
        // dispatch('updateparent');
        break;
      default:
        break;
    }
  };

  toggleComment = () => {
    var line = document.getSelection().focusNode.parentNode;
    var text = line.innerText;
    var inactive = this.re_comments.test(text);
    var prefix = inactive ? "" : "> ";
    var toggle = prefix + text.replace(this.re_comments, "").trim();

    line.innerText = toggle;
    return toggle;
  };

  catchTriggers = e => {
    var diff = e.timeStamp - this.ts;
    var delay = diff < 200;
    this.ts = e.timeStamp;
    var value = e.target.innerText;

    if (diff > 250 * 3) {
      this.history = [];
    }

    this.history.push(e.key);
    this.history = this.history.slice(-5);

    this.execTrigger(delay, this.history.join(""), value);
  };

  handleChange = e => {
    this.catchTriggers(e);

    const { innerText } = e.target;
    const candidate = getCandidate(innerText);
    const words = candidate.split(" ").length;

    // this.setState({ value: plainTextToHtml(innerText) });
    this.parent = this.parent || document.getElementById(this.state.current);
    this.parent.innerText = candidate;
    this.parent.dataset.versions = innerText;
    this.parent.setAttribute("data-word-count", words);

    store.dispatch({ type: "CONTENT-WORD-COUNT", value: u.wordCount() });
  };

  handleBlur = () => {
    store.dispatch({ type: "CONTENT-TIMESTAMP" });
  };

  render() {
    let { current, value = "" } = this.state;
    return (
      <div className="editor">
        <Resizer store={store} />
        <Footer store={store} />
        <div className="inner">
          <span className="uuid">{current}</span>
          <div
            id="io"
            className="textarea"
            contentEditable
            onKeyDown={this.handleChange}
            onBlur={this.handleBlur}
            dangerouslySetInnerHTML={{ __html: value }}
          />
        </div>
      </div>
    );
  }
}
export default Editor;
