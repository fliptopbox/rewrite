import download from "../utilities/download";

const buttons = [
  {
    id: "menuItems",
    groupId: "footer",
    type: "button",
    text: "[#]",
    className: "",
    title: "Show/hide the button menu items",
    fn: function(e) {
      const g = document.querySelector("#main");
      g.classList.toggle("hidden");
    }
  },
  { id: "main", type: "group", groupId: "footer", className: "hidden" },
  {
    id: "fileItems",
    groupId: "main",
    type: "button",
    text: "[[|]]",
    className: "",
    title: "Show/hide the button menu items",
    fn: function(e) {
      const g = document.querySelector("#gfiles");
      g.classList.toggle("hidden");
    }
  },
  { id: "gfiles", type: "group", groupId: "main", className: "hidden" },
  {
    id: "menuItemsFont",
    groupId: "main",
    type: "button",
    text: "--||-",
    className: "",
    title: "Show/hide the button menu items",
    fn: function(e) {
      const g = document.querySelector("#gfont");
      g.classList.toggle("hidden");
    }
  },
  { id: "gfont", type: "group", groupId: "main", className: "hidden" },
  {
    id: "fontsize",
    groupId: "gfont",
    className: "fontsize",
    type: "custom",
    title: "Change the font size",
    tag: "label",
    element: "#fontsize",
    on: "input",
    fn: function(e) {
      const { value } = e.target;
      document.querySelector("body").style.fontSize = `${value}px`;
      document.querySelector("#fontvalue").innerText = `${value}`;
      this.state.values.fontsize = Number(value);
      this.save();
    },
    innerHTML: `<input type="range" id="fontsize" name="fontsize"
          list="sizes" min="14" max="48"
          value="24" />
      <div id="fontvalue">24</div>
      <datalist id="sizes">
        <option value="14" label="14">
        <option value="16">
        <option value="18">
        <option value="21">
        <option value="24" label="24">
        <option value="36">
        <option value="48" label="48">
      </datalist>`
  },
  {
    id: "collapsed",
    groupId: "main",
    type: "button",
    text: "[...]",
    className: "",
    title: "Collapse comment text into one line",
    fn: function(e) {
      const { collapsed = false } = this.state.modifiers;
      this.state.modifiers.collapsed = !collapsed;
      this.toggleClassName("collapsed");
    }
  },
  {
    id: "strikeThrough",
    groupId: "main",
    type: "button",
    text: "-A-",
    className: "",
    title: "strike through inactive text",
    fn: function(e) {
      const { strikethrough = false } = this.state.modifiers;
      this.state.modifiers.strikethrough = !strikethrough;
      this.toggleClassName("strikethrough");
    }
  },
  {
    id: "themeToggle",
    groupId: "main",
    type: "button",
    text: "0:1",
    className: "",
    title: "Toggle dark/light theme",
    fn: function(e) {
      const { dark = false } = this.state.modifiers;
      this.state.modifiers.dark = !dark;
      this.toggleClassName("dark");
    }
  },
  {
    id: "readSelected",
    groupId: "main",
    type: "button",
    text: "|>",
    className: "",
    title: "Read the selected paragraph (play|pause)",
    fn: function() {}
  }
];

buttons.push({
  id: "uploadInput",
  groupId: "gfiles",
  type: "custom",
  tag: "label",
  innerHTML: `<span>upload</span><input id="uploadInput" class="hidden" type="file" accept="text/*" >`,
  element: "#uploadInput",
  on: "change",
  fn: function() {}
});

buttons.push({
  id: "typewriter",
  groupId: "main",
  type: "button",
  text: ">>",
  className: "",
  title: "Typewriter mode. Disables editing.",
  fn: function() {}
});

function getList(asArray = false) {
  const list = this.store.list();
  const string = list.map((row, n) => `${n + 1}) ${row.name} (${row.guid})`);
  return asArray ? list : string.join("\n");
}

buttons.push({
  id: "filesLoad",
  groupId: "gfiles",
  type: "button",
  text: "load",
  title: "Load an existing file",
  fn: function() {
    const list = getList.call(this, true);
    const string = getList.call(this, false);
    const message = [
      "SELECT INDEX OF FILE TO LOAD:",
      "-----------------------------",
      "0) Cancel",
      string,
      "",
      "Select file index."
    ].join("\n");

    const index = window.prompt(message) || 0;
    const value = Number(index) - 1;
    const max = Math.min(list.length - 1, value);

    if (value < 0) return;

    console.log(value, max, index);
    const guid = list[max].guid;
    const { data } = this.store.read(guid);
    if (!data) {
      console.log("cant find document", index, value, guid, data);
      return;
    }
    this.article.init(data);
  }
});
buttons.push({
  id: "filesList",
  groupId: "gfiles",
  type: "button",
  text: "list",
  title: "list of files!",
  fn: function() {
    const string = getList.call(this, false);
    const msg = ["LIST OF FILES:", "-------------", string].join("\n");
    window.alert(msg);
  }
});

buttons.push({
  id: "filesRenamer",
  groupId: "gfiles",
  type: "button",
  text: "rename",
  title: "Rename current file",
  fn: function() {
    const { guid, name } = this.store.current;
    const msg = `RENAME FILE`;
    const newname = window.prompt(msg, name) || name;
    this.store.rename(guid, newname);
    this.store.current.name = newname;
  }
});

buttons.push({
  id: "filesBlank",
  groupId: "gfiles",
  type: "button",
  text: "new",
  title: "Create a new file",
  fn: function() {
    const newarticle = this.store.create(null, "Untitled", [{}]);
    this.article.init([{}]);
  }
});

buttons.push({
  id: "filesDownload",
  groupId: "gfiles",
  type: "button",
  text: "download",
  title: "Download the current file as plainText",
  fn: function() {
    const innerText = this.article.texteditor;

    const { current } = this.store;
    const { name, guid } = current;

    console.log(222, name, guid, innerText, current);
    const options = { id: guid, name, data: innerText, type: "text" };
    return download(options);
  }
});

buttons.push({
  id: "filesExport",
  groupId: "gfiles",
  type: "button",
  text: "export",
  title: "Export current article as JSON",
  fn: function() {
    const { current } = this.store;
    const { name, guid, data } = current;
    const options = { name, data: current, id: guid, type: "json" };
    return download(options);
  }
});

export default buttons;
