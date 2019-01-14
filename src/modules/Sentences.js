import Texteditor from "./Texteditor/";
import u from "../utilities/";

class Senetences extends Texteditor {
  constructor(id, options) {
    super(id, options);
    this.parse(null, { flag: "inactive", hidden: true });
    this.on("change", null, updateSelectedParagraph);
    this.on("toggle", /(shiftshift)$/i, toggleInactiveFlag);
    this.on("capitalize", /(altenter)$/i, toggleStringCase);
    this.on("click", null, () => {});
  }
}

export default Senetences;

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
