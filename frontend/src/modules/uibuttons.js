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
    id: "collapsed",
    groupId: "settings",
    type: "li",
    text: "Collapse line",
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
    groupId: "settings",
    type: "li",
    text: "Strike through",
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
    groupId: "settings",
    type: "li",
    text: "Toggle dark theme",
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
    groupId: "settings",
    type: "li",
    text: "Read current paragraph",
    className: "",
    title: "Read the selected paragraph (play|pause)",
    fn: function() {}
  },
  {
    id: "typewriter",
    groupId: "settings",
    type: "li",
    text: "Typewriter mode",
    className: "",
    title: "Typewriter mode. Disables editing.",
    fn: function() {}
  },
  {
    id: "gfont",
    type: "group",
    tag: "li",
    groupId: "settings",
    className: "xidden"
  },
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
    innerHTML: `
      <span>
           Font size
           <span id="fontvalue">24</span>
       </span>
      <input type="range" id="fontsize"
          name="fontsize" list="sizes" 
          min="14" max="48"
          value="24" />

      <datalist id="sizes">
        <option value="14" label="14">
        <option value="16">
        <option value="18">
        <option value="21">
        <option value="24" label="24">
        <option value="36">
        <option value="48" label="48">
      </datalist>`
  }
];

buttons.push({
  id: "filesBlank",
  groupId: "actions",
  type: "li",
  text: "New",
  title: "Create a new file",
  fn: function() {
    const newarticle = this.store.create(null, "Untitled", [{}]);
    this.article.init([{}]);
  }
});

buttons.push({
  id: "uploadInput",
  groupId: "actions",
  type: "custom",
  tag: "li",
  innerHTML: `<label for="uploadInput"><span>Open</span><input id="uploadInput" class="hidden" type="file" accept="text/*" ></label>`,
  element: "#uploadInput",
  on: "change",
  fn: function() {}
});

function getList(asArray = false) {
  const list = this.store.list();
  const string = list.map((row, n) => `${n + 1}) ${row.name} (${row.guid})`);
  return asArray ? list : string.join("\n");
}

buttons.push({
  id: "filesDownload",
  groupId: "gfiles",
  type: "button",
  text: "download",
  title: "Download the current file as plainText",
  fn: function() {
    //! this needs to parse the current file
    //! using innerText causes double linebreaks :(

    const { innerText } = this.article.texteditor;
    const { current } = this.store;
    const { name, guid } = current;
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
