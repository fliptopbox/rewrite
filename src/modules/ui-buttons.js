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
    id: "uploadInput",
    groupId: "gfiles",
    type: "custom",
    tag: "label",
    innerHTML: `<span>upload</span><input id="uploadInput" class="hidden" type="file" accept="text/*" >`,
    element: "#uploadInput",
    on: "change",
    fn: function() {}
  },
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
  },
  {
    id: "typewriter",
    groupId: "main",
    type: "button",
    text: ">>",
    className: "",
    title: "Typewriter mode. Disables editing.",
    fn: function() {}
  }
];

export default buttons;
