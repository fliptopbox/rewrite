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
    this.fontsize = this.fontsize.bind(this);
    this.collapse = this.collapse.bind(this);
    this.strikeThrough = this.strikeThrough.bind(this);
    this.toggleTheme = this.toggleTheme.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);

    // enforce the current settings
    for (let key in this.state.modifiers) {
      console.log(key, this.state.modifiers[key]);
      this.toggleClassName(key, this.state[key]);
    }
    // enforce the current settings
    for (let key in this.state.values) {
      const value = this.state.values[key];
      console.log(key, value);

      this[key](value);
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
    const method = this.state.modifiers[string] ? "add" : "remove";
    element.classList[method](string);
    this.save();
  }

  collapse() {
    const { collapsed } = this.state.modifiers;
    this.state.modifiers.collapsed = !collapsed;
    this.toggleClassName("collapsed");
    return collapsed;
  }

  strikeThrough() {
    const { strikethrough } = this.state.modifiers;
    this.state.modifiers.strikethrough = !strikethrough;
    this.toggleClassName("strikethrough");
    return strikethrough;
  }

  toggleTheme() {
    const { dark = false } = this.state.modifiers;
    this.state.modifiers.dark = !dark;
    this.toggleClassName("dark");
  }
  toggleMenu(id) {
    const { showfooter = false } = this.state.modifiers;
    this.state.modifiers.showfooter = !showfooter;
    this.toggleClassName("showfooter");
    this.save();
  }
  fontsize(value) {
    document.querySelector("body").style.fontSize = `${value}px`;
    document.querySelector("#fontvalue").innerText = `${value}`;
    this.state.values.fontsize = Number(value);
    this.save();
  }
}

export default Controller;
