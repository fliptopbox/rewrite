import React from "react";
import Resizer from "./Resizer";
import SampleLinks from "./SampleLinks";
import FontSettings from "./FontSettings";
import getCandidate from "../modules/extractCandidateText";

let store;

const Footer = () => {
  return (
    <span className="buttons">
      <SampleLinks />
      <FontSettings store={store} />
    </span>
  );
};

let timer;
const delay = 555;
let $parent;

const handleKeyUp = e => {
  const text = e.target.value;

  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    const state = store.getState();
    const id = state.editor.current;
    const candidate = getCandidate(text);
    const el = document.getElementById(id);
    if (!el) return;

    store.dispatch({
      type: "EDITOR-LOAD",
      id: id,
      text: text
    });

    // store.dispatch({
    //   type: "CONTENT-CHANGE",
    //   text: candidate
    // });

    el.innerText = candidate;
    el.dataset.versions = text;
  }, delay);
};

const handleFocus = e => {
  $parent = $parent || document.getElementById(e.target.id);
};

const Editor = props => {
  store = store || props.store;

  return (
    <div className="editor">
      <Resizer store={store} />
      <Footer />
      <div className="inner">
        <textarea id="io" onKeyUp={handleKeyUp} onFocus={handleFocus} />
      </div>
    </div>
  );
};

export default Editor;
