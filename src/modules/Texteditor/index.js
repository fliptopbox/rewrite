import marked from "marked";
import bindEvents from "./bindEvents";
import config from "../../config";
import arrayToHtml from "./arrayToHtml";
import load from "./load";
import defer from "../../utilities/defer";
import uuid from "../../utilities/uuid";
import collectionToHtml from "../../utilities/collectionToHtml";
import updateKeysPressed from "./updateKeysPressed";
import Parse from "../../utilities/Parse";

document.execCommand("defaultParagraphSeparator", false, "p");

class Texteditor {
  constructor(id, options) {
    const container = document.getElementById(id);
    const texteditor = document.createElement("article");

    texteditor.setAttribute("contenteditable", "");

    container.innerHTML = "";
    container.appendChild(texteditor);

    this.id = id; // container ID
    this.parent = null;
    this.keytime = null;
    this.selected = null;

    this.container = container;
    this.texteditor = texteditor;

    this.triggers = {
      click: {
        fn: s => console.warn("Default event. CLICK [%s]", s)
      },
      change: {
        fn: s => console.warn("Default event. CHANGE [%s]", s)
      },
      after: {
        fn: s => console.warn("Default event. AFTER [%s]", s)
      }
    };

    // import external config settings
    Object.assign(this, config, options);

    let { defaultText, hidden } = this;
    defaultText = (defaultText || "").trim();
    defaultText = defaultText ? defaultText.split("\n") : [];
    defaultText.push("");

    // external modules
    bindEvents.bind(this)();
    this.defer = defer.bind(this);
    this.uuid = uuid.bind(this);
    this.arrayToHtml = arrayToHtml.bind(this);
    this.updateKeysPressed = updateKeysPressed.bind(this);

    // and lastly ... instanate
    this.init(defaultText);
    this.show(!hidden);
  }

  bindTo(parent) {
    this.parent = parent;
  }

  show(bool) {
    bool = bool === undefined ? true : Boolean(bool);

    this.hidden = bool !== true;
    this.container.classList[this.hidden ? "add" : "remove"]("hidden");
  }

  trigger(ns, e) {
    if (!ns || !this.triggers[ns]) return;

    const { fn, data } = this.triggers[ns];
    const result = fn.call(this, e);

    // pass result to callback
    if (data && data.constructor === Function) {
      console.log(result, data);
      data.call(this, result);
    }

    return result;
  }

  on(key, re, fn, data) {
    this.triggers[key] = { re, fn, data };
  }

  deselect(selector = "selected") {
    const array = this.texteditor.querySelectorAll(`.${selector}`);
    [...array].forEach(el => {
      el.classList.remove(selector);
    });
    this.selected = null;
  }

  setSelected(el = null, newid = null) {
    let { id, innerText, innerHTML, target, focusNode } = el;

    // console.log("[%s]", el.innerText.trim(), el);
    // if this element has text then set focus attributes
    if (innerText && innerText.trim()) {
      el.id = id || this.uuid();
      el.classList.add("selected");
      this.selected = el;
    }
  }

  /*

    init method is used to open of create an article.
    - open: document id
    - create: document string

    */
  init(array) {
    // console.log(array);
    if (!array) return;

    const p = new Parse(array);

    // const isTextArray = typeof array[0];
    // let html;

    // if (isTextArray === "string") {
    //   console.log(1);
    //   html = this.arrayToHtml(array);
    // }

    // if (isTextArray === "object") {
    //   console.log(2);
    //   html = collectionToHtml(array);
    // }

    this.texteditor.innerHTML = p.toHTML();
    // this.texteditor.innerHTML = html;
    this.show();
  }

  // updates the currently selected element
  // transforms (versions) string array into innerText
  update(array = null) {
    console.log("UPDATE [%s]\n", array, this.selected);

    if (this.selected && array) {
      const { newLine, commentChars } = this.re;

      this.selected.classList.add("locked");
      this.selected.dataset.versions = JSON.stringify(array);

      const innerText = array
        .map(s => {
          let text = newLine.test(s) ? "\n\n" : s;
          text = commentChars.test(text) ? "" : text;
          return text;
        })
        .join(" ")
        .trim();

      this.selected.classList[innerText ? "remove" : "add"]("empty");
      this.selected[innerText ? "innerText" : "innerHTML"] =
        innerText || "(empty)";
    }

    // // this MUST be the very last trigger event.
    // console.log("UPDATE", this.id);
    // this.defer("after", this.triggers.after.fn, this.timer.after);
  }

  // export needs to take the current DOM, parse it into a collectio
  // then it needs to add onther meta data so that it can be
  // used as a definitive article-key
  //

  /*
     {
        uuid: "ace123ace123ace321",
        filename: "finding the fold".
        created: Timestamp,
        opened: Timestamp
        data: [..collection]
     }
    */
  // export(n = 0) {
  //   const format = ["innerText", "innerHTML"];
  //   const value = this.texteditor[format[n]];
  //   console.log("EXPORT [%s]", format[n], value);
  //   return value;
  // }

  // toHtml() {
  //   // parses the current dom candidates as markdown
  //   return marked(this.export(0));
  // }
  // (prefix = "a", i = 0) {
  //   return () => `${prefix}${i++}`;
  // }
}

Texteditor.prototype.load = load;

export default Texteditor;

const guid = ((prefix = "a", i = 0) => {
  return () => `${prefix}${i++}`;
})();
