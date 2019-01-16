import marked from "marked";
import bindEvents from "./bindEvents";
import config from "./config";

document.execCommand("defaultParagraphSeparator", false, "p");

class Texteditor {
  constructor(id, options) {
    const container = document.getElementById(id);
    const texteditor = document.createElement("article");

    texteditor.setAttribute("contenteditable", "");

    container.innerHTML = "";
    container.appendChild(texteditor);

    this.id = null;
    this.parent = null;
    this.keytime = null;
    this.selected = null;
    this.keyHistory = [];
    this.uuid = this.uuid(this.prefix);

    this.container = container;
    this.texteditor = texteditor;

    this.triggers = {
      click: {
        fn: s => console.warn("Default event. CLICK [%s]", s)
      },
      change: {
        fn: s => console.warn("Default event. CHANGE [%s]", s)
      }
    };

    // import external config settings
    Object.assign(this, config, options);

    let { defaultText, hidden } = this;

    defaultText = (defaultText || "").trim();
    defaultText = defaultText ? defaultText.split("\n") : [];
    defaultText.push("");

    this.init(defaultText);
    this.show(!hidden);

    // external modules
    bindEvents.bind(this)();
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

  defer(ns, fn) {
    const { timer } = this;

    timer[ns] = timer[ns] || { ns, fn, t: null };
    timer[ns].t && clearTimeout(timer[ns].t);
    timer[ns].t = setTimeout(() => {
      fn();
      delete timer[ns];
      // console.log("EXECUTING DEFERRED [%s]", ns);
    }, timer.delay);
  }

  updateKeysPressed(string = null) {
    let keyHistory = [...this.keyHistory];

    if (!string) return (this.keyHistory = []);

    keyHistory.push(string);

    this.keytimer && clearTimeout(this.keytimer);
    this.keytimer = setTimeout(() => {
      this.keyHistory = [];
    }, 250);

    return (this.keyHistory = [...keyHistory]);
  }

  // executeToggle(e) {
  //   return this.triggers.toggle.fn.call(this, e);
  // }

  on(key, re, fn, data) {
    this.triggers[key] = { re, fn, data };
  }

  deselect(selector = "selected") {
    const array = this.texteditor.querySelectorAll(`.${selector}`);
    [...array].forEach(el => el.classList.remove(selector));
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

  parse(array, obj) {
    // update the global parsing settings
    if (obj) {
      this.options = {
        ...this.options,
        ...obj
      };
    }

    // no array ... exit
    if (!array) return;

    // shortcut to the settings
    const { flag, re, tag, br } = this.options;

    // iterare over incoming array of strings
    // output a catenated DOM string (innerHTML)
    return [...array]
      .map(s => {
        let innerText = `${s}`.replace(re, "").trim() || br;
        const className = re.test(s || "") ? ` class="${flag}"` : "";
        return `<${tag}${className}>${innerText}</${tag}>`;
      })
      .join("\n");
  }

  init(array) {
    this.texteditor.innerHTML = this.parse(array);
    this.show();
  }

  // updates the currently selected element
  // transforms (versions) string array into innerText
  update(array = null) {
    // console.log("UPDATE [%s]\n", array, this.selected);

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
  }

  export(n = 0) {
    const format = ["innerText", "innerHTML"];
    const value = this.texteditor[format[n]];
    console.log("EXPORT [%s]", format[n], value.length);
  }

  toHtml() {
    // parses the current dom candidates as markdown
    return marked(this.export(0));
  }
  uuid(prefix = "a", i = 0) {
    return () => `${prefix}${i++}`;
  }
}

export default Texteditor;

const guid = ((prefix = "a", i = 0) => {
  return () => `${prefix}${i++}`;
})();