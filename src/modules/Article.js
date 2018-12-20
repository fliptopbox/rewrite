import React, { Component } from "react";
// import saveAs from "file-saver";

import stateMonitor from "./stateMonitor";
import u from "../utilities/";

let store;

const Menu = () => {
  return <div className="menu">save | font | size | word count</div>;
};

class Article extends Component {
  constructor(props) {
    super();

    store = props.store;

    const { content } = store.getState();
    this.state = Object.assign({}, content);

    const watch = stateMonitor(store.getState, "content.string");
    const announce = current => {
      if (store.getState().content.string) {
        store.dispatch({ type: "CONTENT-CLEAR", value: null });
        this.load(current);
      }
    };
    store.subscribe(() => watch(announce));
  }

  load = text => this.setState({ collection: u.textToCollection(text) });

  save = () => store.dispatch({ type: "CONTENT-TIMESTAMP" });

  updateEditor = (id, text) => {
    let type = "EDITOR-BIND";

    if (!text) {
      type = "EDITOR-RESET";
      text = null;
    }

    store.dispatch({ type, id, text });
  };

  eventToObject = e => {
    const { id, dataset, innerText } = e.target;
    const versions = dataset.versions || undefined;
    const text = innerText.trim();
    const locked = versions ? true : false;

    return Object.assign(
      {},
      {
        id,
        text,
        versions,
        locked
      }
    );
  };

  handlePaste = e => {
    const selection = window.getSelection();
    const parent = selection.focusNode.parentNode;

    console.log("clipboard paste", parent.nodeName);
  };

  handleKeyDown = e => {
    const el = window.getSelection().focusNode.parentNode;
    const { id = null, nodeName = null, dataset = null } = el;
    const keyspressed = u.keysPressed(e);

    console.log(keyspressed, nodeName, /^enter/i.test(keyspressed));

    const isDiv = /^div$/i.test(nodeName);
    if (!isDiv) return;

    const isArrow = /^arrow/i.test(keyspressed);
    const isEnter = /^enter/i.test(keyspressed);
    const isReadOnly = dataset && dataset.versions ? true : false;

    if (!isArrow && isReadOnly) {
      console.log("is NOT an arrow key and read only");
      e.preventDefault();
      return false;
    }

    if (isEnter) {
      console.log("is enter, remove id and className");
      el.removeAttribute("id", "");
      el.className = "";
    }

    if (isReadOnly && !id) {
      console.log("is readonly without an ID");
      el.id = u.uuid();
    }

    this.save();
  };

  handleClick = e => {
    // If the row has versions then it is locked.
    // Add the className and refresh the Editor
    // The Editor needs a DOM reference and a value.
    const { id, versions } = this.eventToObject(e);
    if (!id || !versions) return;

    store.dispatch({ type: "EDITOR-BIND", id, text: versions });
  };

  handleDblClick = e => {
    let { id, text, locked } = this.eventToObject(e);
    let multiline = "";
    let method = "remove";
    let type = "EDITOR-RESET";

    // This is a toggle action:

    // if the row has version data (ie. locked)
    // then present warning and delete versions
    // NOTE: a shift + double click bypasses the warning.

    const confirmed = locked && (e.shiftKey || window.confirm("Are you sure?"));

    if (locked && !confirmed) return;

    // if the row has no version data (ie. not locked)
    // then create a dataset and dispatch a notification

    if (!locked) {
      multiline = u.inflate(text);
      id = u.uuid();
      type = "EDITOR-BIND";
      method = "add";
      e.target.id = id;
    }

    e.target.dataset.versions = multiline;
    e.target.classList[method]("locked");
    e.target.classList[method]("selected");

    store.dispatch({ type, id, text: multiline });

    return;
  };

  render() {
    const { collection } = this.state;

    const html = collection.map((row, n) => {
      if (!row) return null;

      let { id, text, versions, className = null } = row;
      className = [versions ? "locked" : "", className].join(" ").trim();
      id = (versions && u.uuid()) || "";

      return (
        <div id={id} key={n} className={className} data-versions={versions}>
          {" "}
          {text || <br />}{" "}
        </div>
      );
    });

    return (
      <section className="content">
        <Menu />
        <article
          contentEditable="true"
          onPaste={this.handlePaste}
          onKeyDown={this.handleKeyDown}
          onClick={this.handleClick}
          onDoubleClick={this.handleDblClick}
        >
          {html}{" "}
        </article>{" "}
      </section>
    );
  }
}

export default Article;
