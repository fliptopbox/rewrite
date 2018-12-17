import React, { Component } from "react";
import u from "../utilities/";

class Article extends Component {
  constructor(props) {
    super();

    const { store } = props;
    const { content } = store.getState();
    this.state = Object.assign({}, content);
    this.timer = null; // timeout container
    window.RE.article = this;
  }

  textToCollection(text) {
    const paras = text.split("\n");

    return paras.map((value, n) => ({
      key: n,
      id: value && value.trim() ? u.uuid() : undefined,
      text: value,
      locked: undefined
    }));
  }

  load(text) {
    const array = this.textToCollection(text);
    this.setState({ collection: array });
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
        const { innerText, id, className } = el;
        return {
          id,
          text: innerText.trim(),
          locked: /locked/gi.test(className)
        };
      });
      console.log(6, "SAVE COLLECTION", collection);
    }, delay);
  }

  handleKeyDown = e => {
    const key = e.key;
    const el = window.getSelection().focusNode.parentNode;
    const { id = null, nodeName = null } = el;

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

  render() {
    const { defaultMsg, collection } = this.state;
    const array = collection.length > 1 ? collection : defaultMsg;

    const html = array.map(row => {
      const { id, key, text, locked } = row;
      const classname = locked ? "locked" : undefined;
      return (
        <div id={id} key={key} className={classname}>
          {text || <br />}
        </div>
      );
    });

    return (
      <div className="content">
        <article contentEditable="true" onKeyDown={this.handleKeyDown}>
          {html}
        </article>
      </div>
    );
  }
}

export default Article;
