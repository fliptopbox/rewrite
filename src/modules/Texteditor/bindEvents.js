function bindEvents() {
  const { texteditor } = this;

  texteditor.onkeydown = handleKeyDown.bind(this);
  texteditor.onkeyup = handleKeyUp.bind(this);
  texteditor.onclick = handleClick.bind(this);
}

export default bindEvents;

function handleKeyDown(e) {
  // if the row is flagged then skip
  // all non-passive key strokes

  const passive = this.re.passiveKeys.test(e.key);
  const versions = this.selected && this.selected.dataset.versions;

  if (versions && !passive) return false;

  this.updateKeysPressed(e.key.trim() || e.code);

  // execute the registered triggers
  const keySequence = this.keyHistory.join("");
  const trigger = Object.keys(this.triggers).find(key => {
    const { re, fn } = this.triggers[key];
    return re && re.test(keySequence) ? fn : null;
  });

  // console.log("ONKEYDOWN", e.key, e.code, keySequence.slice(-5));
  return this.trigger(trigger, e);
}

function handleKeyUp(e) {
  this.deselect();

  const passive = this.re.passiveKeys.test(e.key);
  const { type, key, code, preventDefault } = e;
  const { focusNode } = window.getSelection();
  const { nodeName } = focusNode.parentNode;

  if (nodeName !== "P") return;

  // console.log("ONKEYUP [%s] <%s>", type, nodeName, key);

  const el = focusNode.parentNode;
  const { innerText } = el;

  // ignore empty lines.
  if (!innerText || !innerText.trim()) {
    this.selected = null;
    return;
  }

  // set "parent" DOM element
  this.selected = el;
  this.selected.classList.add("selected");
  this.selected.id = this.selected.id || this.uuid();

  // after all triggers always emit the change event.
  // ensure arrowkeys are processed immediately
  this.timer.delay = passive ? 25 : this.timer.default;
  this.defer("change", () => this.triggers.change.fn.call(this, e));
}

function handleClick(e) {
  this.deselect();
  this.setSelected(e.target);
  this.triggers.click && this.triggers.click.fn.call(this, e);
}
