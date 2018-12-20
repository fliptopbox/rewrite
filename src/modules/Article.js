import React, { Component } from "react";
import u from "../utilities/";

let store;
// let $editor;

class Article extends Component {
  constructor(props) {
    super();

    store = props.store;

    const { content } = store.getState();
    this.state = Object.assign({}, content);
    this.timer = null; // timeout container

    // $editor = document.getElementById("id");
    // window.RE.article = this;
  }

  load(text) {
    const array = u.textToCollection(text);
    this.setState({
      collection: array
    });
  }

  clear() {
    this.setState({
      collection: []
    });
  }

  save() {
    // Prevent rapid saving.
    const delay = 1000;
    this.timer && clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      // grab the children Elements and
      // convert them into a Collection

      const children = document.querySelector("article").childNodes;
      const collection = u.nodesToCollection(children);

      store.dispatch({
        type: "CONTENT-SAVE",
        value: collection
      });
    }, delay);
  }

  updateEditor = (id, text) => {
    store.dispatch({
      type: "EDITOR-PARENT",
      id,
      text
    });
    // $editor = $editor || document.getElementById("io");
    // $editor.value = String(value) || "";
    // $editor.dataset.parent = id;
    // $editor.focus();
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
    const { id, locked, versions } = this.eventToObject(e);
    if (!locked) return;

    console.log("single click", locked);
    this.updateEditor(id, versions);
  };

  handleDblClick = e => {
    const { id, text, locked } = this.eventToObject(e);
    let multiline = "";
    let method = "remove";

    console.log("double click", e.shiftKey);
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
      method = "add";
    }

    e.target.dataset.versions = multiline;
    e.target.classList[method]("locked");
    this.updateEditor(id, multiline);
    this.save();
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
          {text || <br />}
        </div>
      );
    });

    return (
      <section className="content">
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
