import u from "../utilities/";
const { read, write } = u.storage("settings");

class Controller {
  constructor(settings = {}) {
    this.state = Object.assign(
      {
        modifiers: {
          collapsed: true,
          strikethrough: true,
          dark: false
        },
        values: {
          fontsize: 24
        }
      },
      settings,
      read()
    );

    this.save = this.save.bind(this);

    // enforce the current settings
    for (let key in this.state.modifiers) {
      console.log(key, this.state.modifiers[key]);
      this.toggleClassName(key, this.state[key]);
    }
    // enforce the current values
    for (let key in this.state.values) {
      const value = this.state.values[key];
      console.log(key, value);

      if (this[key]) {
        this[key](value);
      }

      // this.toggleClassName(key, this.state[key]);
    }
  }
  save() {
    const prev = read() || {}; // remember divider.js also saves settings
    const data = { ...prev, ...this.state };
    write(data);
    return data;
  }

  toggleClassName(string, value, selector = "body") {
    if (typeof value === "boolean") {
      this.state.modifiers[string] = value;
    }

    const element = document.querySelector(selector);
    const current = this.state.modifiers[string];
    const method = current ? "add" : "remove";
    element.classList[method](string);
    this.save();
    return current;
  }
  addButton(options) {
    const { id, title, text, className, fn, groupId } = options;
    const footer = document.querySelector(`#${groupId}`);
    const button = document.createElement("button");

    button.id = id;
    button.setAttribute("title", title);
    button.innerHTML = `<span>${text}</span>`;
    button.onclick = fn.bind(this);

    footer.appendChild(button);
  }

  addCustomButton(options) {
    const {
      id,
      tag,
      groupId,
      innerHTML,
      className = "",
      title = "",
      element,
      on,
      fn
    } = options;

    const footer = document.querySelector(`#${groupId}`);
    const el = document.createElement(tag);
    el.setAttribute("for", id);
    el.setAttribute("title", title);
    el.className = className;
    el.innerHTML = innerHTML;
    const handle = el.querySelector(element);
    handle[`on${on}`] = fn.bind(this);
    footer.appendChild(el);
  }

  addGroup(options) {
    const { id, groupId, className } = options;
    const footer = document.querySelector(`#${groupId}`);
    const g = document.createElement("div");
    g.id = id;
    g.className = "group group-" + groupId + " " + className;
    footer.appendChild(g);
  }

  initialize(array, store, article) {
    this.store = store;
    this.article = article;

    document.querySelector("#footer").innerHTML = "";
    const that = this;
    array.forEach(row => {
      if (row.type === "button") {
        this.addButton.call(that, row);
      }
      if (row.type === "custom") {
        this.addCustomButton.call(that, row);
      }
      if (row.type === "group") {
        this.addGroup(row);
      }
      return;
    });
  }
}

export default Controller;
