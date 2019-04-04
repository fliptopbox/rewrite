function bindEvents() {
    const { texteditor } = this;

    texteditor.onkeydown = handleKeyDown.bind(this);
    texteditor.onkeyup = handleKeyUp.bind(this);
    texteditor.onclick = handleClick.bind(this);
}

export default bindEvents;

function handleKeyDown(e) {
    // if the row is flagged (ie. locked) then skip
    // all non-passive key strokes

    const passive = this.re.passiveKeys.test(e.key);
    const versions = this.selected && this.selected.dataset.versions;

    if (versions && !passive) {
        console.log('versions and NOT passive');
        return false;
    }

    // execute the registered triggers
    const keySequence = this.updateKeysPressed(e, true);
    const trigger = Object.keys(this.triggers).find(key => {
        const { re, fn } = this.triggers[key];
        return re && re.test(keySequence) ? fn : null;
    });

    console.log('ONKEYDOWN', e.key, e.code, keySequence);
    return this.trigger(trigger, e);
}

function handleKeyUp(e) {
    this.deselect();

    const passive = this.re.passiveKeys.test(e.key);
    const { type, key } = e;
    const { focusNode } = window.getSelection();
    const { nodeName } = focusNode.parentNode;
    let el = focusNode.parentNode;

    // Enter will copy the id attribute to an empty node
    // the id MUST stay unique
    if (/^enter/i.test(key)) {
        focusNode.id = '';
        this.deselect();
        return;
    }

    if (nodeName !== 'P') {
        console.log('not P tag', type);
        return;
    }

    const { innerText } = el;

    // ignore empty lines.
    if (!innerText || !innerText.trim()) {
        console.log('no inner text');
        this.deselect();
        return;
    }

    // set "parent" DOM element
    this.setSelected(el);

    console.log('ONKEYUP [%s] <%s>', type, nodeName, key);

    // change the ms delay and ensure arrowkeys are processed immediately
    const ms = this.timer.after;
    this.timer.delay = passive ? 75 : this.timer.default;

    // after all triggers always emit the change event.
    this.defer('change', () => this.triggers.change.fn.call(this, e));

    // refresh the wordcounter
    this.wordcounter();

    // this MUST be the very last trigger event.
    this.defer('after', () => this.triggers.after.fn.call(this), ms);
}

function handleClick(e) {
    this.deselect();
    this.setSelected(e.target);
    this.triggers.click && this.triggers.click.fn.call(this, e);
}
