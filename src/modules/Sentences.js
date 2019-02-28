import Texteditor from "./Texteditor/";
import u from "../utilities/";

class Senetences extends Texteditor {
  constructor(id, options) {
    super(id, options);

    // update the options
    this.arrayToHtml(null, { hidden: true });

    // create the local triggers
    this.on("change", null, updateSelectedParagraph);
    this.on("toggle", /(shiftshift)$/i, toggleInactiveFlag);
    this.on("capitalize", /(altenter)$/i, toggleStringCase);
      this.on("deleteline", /(altbackspace)$/i, deleteCurrentLine);
    this.on("click", null, () => {});
  }
}

export default Senetences;

function deleteCurrentLine (e) {
    e.preventDefault();
    e.stopPropagation();
    console.log(e.target)
    this.selected.remove();
}

function toggleStringCase() {
  const { innerText } = this.selected;
  this.selected.innerText = u.toggleStringCase(innerText);
}

function updateSelectedParagraph() {
  const { children } = this.texteditor;
  const array = u.childrenToVersionArray(children);
  this.parent.update(array);
}

function toggleInactiveFlag(e) {
  this.selected.classList.toggle("inactive");
}
