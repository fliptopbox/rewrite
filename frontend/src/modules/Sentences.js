import Texteditor from './Texteditor/';
import u from '../utilities/';

class Senetences extends Texteditor {
    constructor(id, options) {
        super(id, options);

        // update the options
        this.arrayToHtml(null, { hidden: true });

        // create the local triggers
        this.on('change', null, updateSelectedParagraph);
        this.on('toggle', /^(shiftshift)$/i, toggleInactiveFlag);
        this.on('capitalize', /^(altenter)$/i, toggleStringCase);
        this.on('newline', /^(shiftenter)$/i, carridgeReturn);
        this.on('deleteline', /^(altbackspace)$/i, deleteCurrentLine);
        this.on('click', null, () => {});
    }
}

export default Senetences;

function carridgeReturn(e) {
    e.preventDefault();
    e.stopPropagation();

    const p = this.selected;
    const cr = document.createElement('p');
    const br = document.createElement('br');
    const sel = window.getSelection();
    const range = document.createRange();

    p.parentNode.insertBefore(cr, p.nextSibling);
    cr.appendChild(br);

    range.setStart(br, 0); // Changed range to start of BR
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);

    return false;
}

function deleteCurrentLine(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log(e.target);
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
    this.selected.classList.toggle('inactive');
}
