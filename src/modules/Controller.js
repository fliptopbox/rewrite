class Controller {
  constructor(settings = {}) {
    this.state = Object.assign(
      {
        collapsed: true,
        strikethrough: true
      },
      settings
    );

    this.collapse = this.collapse.bind(this);
    this.strikeThrough = this.strikeThrough.bind(this);

    // enforce the current settings
    for (let key in this.state) {
      console.log(key, this.state[key]);
      this.toggleClassName(key, this.state[key]);
    }
  }

  toggleClassName(string, value, selector = "body") {
    if (typeof value === "boolean") {
      this.state[string] = value;
    }

    const element = document.querySelector(selector);
    const method = this.state[string] ? "add" : "remove";
    element.classList[method](string);
  }

  collapse() {
    const { collapsed } = this.state;
    this.state.collapsed = !collapsed;
    this.toggleClassName("collapsed");
    return collapsed;
  }

  strikeThrough() {
    const { strikethrough } = this.state;
    this.state.strikethrough = !strikethrough;
    this.toggleClassName("strikethrough");
    return strikethrough;
  }
}

export default Controller;
