import React, { Component } from "react";
import u from "../utilities/";

let store;
let $editor;

class Article extends Component {
  constructor(props) {
    super();

    store = props.store;

    const { content } = store.getState();
    this.state = Object.assign({}, content);
    this.timer = null; // timeout container
    $editor = document.getElementById("id");

    window.RE.article = this;
  }

  textToCollection(text) {
    const paras = text.split("\n");

    return paras.map((value, n) => ({
      key: n,
      id: value && value.trim() ? u.uuid() : "",
      text: value,
      locked: ""
    }));
  }

  load(text) {
    const array = this.textToCollection(text);
    this.setState({ collection: array });
  }

  clear() {
    this.setState({ collection: [] });
  }

  save() {
    // Prevent rapid saving.
    const delay = 1000;
    this.timer && clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      // grab the children Elements and
      // convert them into a Collection

      const children = document.querySelector("article").childNodes;
      const collection = [...children].map(el => {
        const { innerText, id, className, dataset } = el;
        const locked = /locked/gi.test(className) || undefined;
        const text = `${innerText}`.trim() || null;

        let versions = (dataset && dataset.versions) || "";

        return { id, text, locked, versions };
      });

      console.log(6, "SAVE COLLECTION", collection);
      store.dispatch({ type: "CONTENT-SAVE", value: collection });

      u.storage().write(store.getState());
    }, delay);
  }

  updateEditor = (id, value) => {
    store.dispatch({ type: "EDITOR-PARENT", id, text: value });
    $editor = $editor || document.getElementById("io");
    $editor.value = String(value) || "";
    $editor.dataset.parent = id;
    $editor.focus();
  };

  eventToObject = e => {
    // Reminder .... the dataset.version
    // is a doubled parsed string
    const { id, dataset, innerText } = e.target;
    const versions = dataset.versions || "";
    const text = innerText.trim();
    const locked = versions ? true : false;

    return { id, text, versions, locked };
  };

  handlePaste = e => {
    console.log("PASTE");

    const selection = window.getSelection();
    const parent = selection.focusNode.parentNode;

    console.log(parent.nodeName);

    // let paste = (e.clipboardData || window.clipboardData).getData("text");
    // this is select all + paste
    // just re-render the whole thing
    // e.preventDefault();
    // e.stopPropagation();
    // console.log(paste);
    // this.load(`\n${paste}`);
    // switch (parent.nodeName) {
    //   case "SECTION":
    //   case "ARTICLE":
    //     break;
    //   case "DIV":
    //     break;
    //   default:
    //     break;
    // }
  };

  handleKeyDown = e => {
    const key = e.key;
    const el = window.getSelection().focusNode.parentNode;
    const { id = null, nodeName = null } = el;
    const keyspressed = u.keysPressed(e);

    console.log(keyspressed, nodeName);

    const isDiv = /^div$/i.test(nodeName);
    if (!isDiv) return;

    const isArrow = /^arrow/i.test(key);
    const isReadOnly = el.classList.contains("locked");
    console.log(1, "readonly", isArrow, isReadOnly);
    if (!isArrow && isReadOnly) {
      e.preventDefault();
      return false;
    }

    console.log(2, "assign UUID");
    if (!id) el.id = u.uuid();

    console.log(3, "handleKeyTriggers");

    console.log(4, "update local strorage");
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

    console.log("double click");
    // This is a toggle action:
    // if the row has versions (aka locked)
    // then present warning and delete versions
    if (locked && window.confirm("Are you sure?")) {
      e.target.dataset.versions = "";
      e.target.classList.remove("locked");
      this.updateEditor(id, null);
      this.save();
      return;
    }

    // if the row is has no version (aka not locked)
    // then create a dataset and pass it to the Editor
    if (!locked) {
      const multiline = u.inflate(text);
      e.target.dataset.versions = multiline;
      e.target.classList.add("locked");
      this.updateEditor(id, multiline);
      this.save();
      return;
    }
  };

  render() {
    const { collection } = this.state;

    const html = collection.map((row, n) => {
      const { id, text, versions, className = null } = row;
      const classname = [versions ? "locked" : "", className].join(" ");
      return (
        <div id={id} key={n} className={classname} data-versions={versions}>
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
          {html}
        </article>
      </section>
    );
  }
}

export default Article;
