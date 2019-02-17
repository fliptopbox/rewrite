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
    // eg: restore vertical divider x positon
    for (let key in this.state.values) {
      const value = this.state.values[key];

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
    const { id, type, title, text, className, fn, groupId } = options;
    const group = document.querySelector(`#${groupId}`);
    const elm = document.createElement(type);

    elm.id = id;
    elm.setAttribute("title", title);
    elm.innerHTML = `<span>${text}</span>`;
    elm.onclick = fn.bind(this);

    group.appendChild(elm);
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

    const group = document.querySelector(`#${groupId}`);
    const el = document.createElement(tag);
    el.setAttribute("for", id);
    el.setAttribute("title", title);
    el.className = className;
    el.innerHTML = innerHTML;
    const handle = el.querySelector(element);
    handle[`on${on}`] = fn.bind(this);
    group.appendChild(el);
  }

  addGroup(options) {
    const { id, groupId, className, tag = "div" } = options;
    const group = document.querySelector(`#${groupId}`);
    const g = document.createElement(tag);
    g.id = id;
    g.className = "group group-" + groupId + " " + className;
    group.appendChild(g);
  }

  getFileRow(object) {
    const { guid, name, words = 1234, modified = 123123123 } = object;
    const row = `
                <span class="file-name" data-guid="${guid}">
                    <span>${name}</span>
                    <a href="#">edit</a>
                </span>
                <div class="file-meta">
                    <a href="#delete">del</a>
                    <i class="file-words">${words} words </i>
                    <i class="file-modified">${modified}</i> 
                    <i class="file-exports">
                        <a href="#">txt</a>
                        <a href="#">json</a>
                    </i>
                </div>`;
    return row;
  }

  getFileList() {
    // load the articles from storage
    let li = "";
    const array = this.store.list().map((row, n) => {
      li = this.getFileRow(row);
      return `<li id="${row.guid}">${li}</li>`;
    });
    const files = document.querySelector("#files");
    files.innerHTML = array.join("");
    files.onclick = e => {
      const { target, dataset, id, current } = e;
      const { parentNode } = target;
      const guid = parentNode.id;
      console.log(target, parentNode.id);
      const { data } = this.store.read(guid);
      if (!data) {
        console.log("cant find document", index, value, guid, data);
        return;
      }
      this.article.init(data);
    };
  }

  initialize(array, store, article) {
    this.store = store;
    this.article = article;

    // clear existing containers
    document.querySelector("#files").innerHTML = "";
    document.querySelector("#settings").innerHTML = "";
    document.querySelector("#footer").innerHTML = "";

    const that = this;
    array.forEach(row => {
      if (/^(button|li)/i.test(row.type)) {
        this.addButton.call(that, row);
      }

      if (row.type === "custom") {
        this.addCustomButton.call(that, row);
      }

      if (row.type === "group") {
        this.addGroup(row);
      }
      return this;
    });
  }
}

export default Controller;
