import Texteditor from "./Texteditor/";
import u from "../utilities/";

class Article extends Texteditor {
  constructor(id, options) {
    super(id, options);

    this.on("click", null, articleToggleActive);
    this.on("toggle", /(shiftshift)$/i, articleToggleActive);
    this.on("change", null, sentencesUpdateContent);
    this.on("mode", /^(ControlControlt)/i, e => {
      e.preventDefault();

      return false;
    });
    this.on(
      "typewriter",
      /(home|end|page|arrow|delete|backspace)/i,
      typewriterMode
    );

    this.typewriter = typewriter.call(this);
  }
}

export default Article;

function sentencesUpdateContent() {
  const array = u.selectedValueArray(this.selected);
  this.parent.init(array);
}

function articleToggleActive(e) {
  e.preventDefault();
  e.stopPropagation();

  // let versions;
  let array = u.selectedValueArray(this.selected);
  let { classList, dataset } = this.selected;
  let { versions } = this.selected.dataset;
  const locked = versions && versions.trim();

  // only double shift (keyboard) allows unlock
  if (/^key/.test(e.type) && locked && window.confirm("Are you sure")) {
    classList.remove("locked");
    dataset.versions = "";
    array = [""];
  }

  // re-load the sentence instatance
  this.parent.init(array);
  return false;
}

function typewriter() {
  let forwardOnly = false; // private variable

  return function(bool) {
    return (forwardOnly = typeof bool === "boolean" ? bool : forwardOnly);
  };
}

function typewriterMode(e) {
  // console.log("typewriter", e.key, e.code);
  if (!this.typewriter()) return;

  e.preventDefault();
  return false;
}
