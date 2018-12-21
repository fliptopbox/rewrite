import React, { Component } from "react";
// import saveAs from "file-saver";

import stateMonitor from "./stateMonitor";
// import u from "../utilities/";

let store;

class WordCount extends Component {
  constructor(props) {
    super();
    store = props.store;
    this.state = {
      wordCount: 0
    };
    const { wordCount } = store.getState().content;
    this.setState({ wordCount });

    const watch = stateMonitor(store.getState, "content.wordCount");
    const announce = value => {
      return this.state.wordCount !== value
        ? this.setState({ wordCount: value })
        : null;
    };
    store.subscribe(() => watch(announce));
  }

  render() {
    return <div className="wordcount">{this.state.wordCount}</div>;
  }
}

export default WordCount;
