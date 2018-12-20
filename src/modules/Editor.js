import React, { Component } from "react";

import getCandidate from "./extractCandidateText";
import Resizer from "./Resizer";
import Footer from "./Footer";

const delay = 555;

let store;
let timer;
let $parent;

const setWordCount = () => {
  $parent.classList.add("selected");
  $parent.setAttribute("data-word-count", 133);
};

const handleKeyUp = e => {
  const text = e.target.value;

  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    const state = store.getState();
    const id = state.editor.current;
    const candidate = getCandidate(text);
    const el = document.getElementById(id);
    // const el = $parent;
    if (!el) return;

    store.dispatch({
      type: "EDITOR-LOAD",
      id: id,
      text: text
    });

    el.innerText = candidate;
    el.dataset.versions = text;
    el.setAttribute("data-word-count", candidate.split(" ").length);

    // setWordCount();

    // u.storage().write(state);
    window.RE.article.save();
  }, delay);
};

const handleFocus = e => {
  $parent = document.getElementById(e.target.id);
  setWordCount();
};

const handleBlur = e => {
  console.log("blur", $parent);
  document.querySelector(".selected").classList.remove("selected");
};

class Editor extends Component {
  constructor(props) {
    super();
    store = props.store;
  }

  render() {
    return (
      <div className="editor">
        <Resizer store={store} />
        <Footer store={store} />
        <div className="inner">
          <textarea
            id="io"
            onKeyUp={handleKeyUp}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
      </div>
    );
  }
}
export default Editor;
