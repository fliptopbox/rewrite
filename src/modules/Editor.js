import React, { Component } from "react";

import stateMonitor from "./stateMonitor";
import getCandidate from "./extractCandidateText";
import Resizer from "./Resizer";
import Footer from "./Footer";

let store;

// const handleBlur = e => {
//   console.log("blur", $parent);
//   document.querySelector(".selected").classList.remove("selected");
// };

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
      const obj = Object.assign({}, store.getState().editor);
      this.setState(obj);
      this.select(current);
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

  handleChange = e => {
    const { value } = e.target;
    const candidate = getCandidate(value);
    const words = candidate.split(" ").length;

    this.setState({ value });

    this.parent = this.parent || document.getElementById(this.state.current);
    this.parent.innerText = candidate;
    this.parent.dataset.versions = value;
    this.parent.setAttribute("data-word-count", words);
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
          <span className="current">{current}</span>
          <textarea
            id="io"
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            value={value || ""}
          />
        </div>
      </div>
    );
  }
}
export default Editor;
