import React from "react";
import Resizer from "./Resizer";
import SampleLinks from "./SampleLinks";
import getCandidate from "../modules/extractCandidateText";

let store;

const Footer = () => {
  return (
    <span className="buttons">
      <SampleLinks />
    </span>
  );
};

let timer;
const delay = 555;

const handleKeyUp = e => {
  const text = e.target.value;

  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    const state = store.getState();
    const id = state.editor.current;
    const candidate = getCandidate(text);

    store.dispatch({
      type: "EDITOR-LOAD",
      id: id,
      text: text
    });

    // store.dispatch({
    //   type: "CONTENT-CHANGE",
    //   text: candidate
    // });

    document.getElementById(id).innerText = candidate;
  }, delay);
};

const Editor = props => {
  store = store || props.store;

  return (
    <div className="editor">
      <Resizer />
      <Footer />
      <div className="inner">
        <textarea id="io" onKeyUp={handleKeyUp} />
      </div>
    </div>
  );
};

export default Editor;
