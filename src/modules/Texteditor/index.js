// import marked from "marked";
import bindEvents from './bindEvents';
import config from '../../config';
import arrayToHtml from './arrayToHtml';
import load from './load';
import defer from '../../utilities/defer';
import uuid from '../../utilities/uuid';
import updateKeysPressed from './updateKeysPressed';
import Parse from '../../utilities/Parse';

document.execCommand('defaultParagraphSeparator', false, 'p');

class Texteditor {
    constructor(id, options) {
        const container = document.getElementById(id);
        const texteditor = document.createElement('article');

        texteditor.setAttribute('contenteditable', '');
        texteditor.setAttribute('spellcheck', 'true');

        container.innerHTML = '';
        container.appendChild(texteditor);

        this.id = id; // container ID
        this.parent = null;
        this.keytime = null;
        this.selected = null;

        this.container = container;
        this.texteditor = texteditor;

        this.triggers = {
            click: {
                fn: s => console.warn('Default event. CLICK [%s]', s),
            },
            change: {
                fn: s => console.warn('Default event. CHANGE [%s]', s),
            },
            after: {
                fn: s => console.warn('Default event. AFTER [%s]', s),
            },
        };

        // import external config settings
        Object.assign(this, config, options);

        let { defaultText, hidden } = this;
        defaultText = (defaultText || '').trim();
        defaultText = defaultText ? defaultText.split('\n') : [];
        defaultText.push('');

        // external modules
        bindEvents.bind(this)();
        this.defer = defer.bind(this);
        this.uuid = uuid.bind(this);
        this.arrayToHtml = arrayToHtml.bind(this);
        this.updateKeysPressed = updateKeysPressed.bind(this);

        // and lastly ... instanate
        this.init(defaultText);
        this.show(!hidden);
    }

    bindTo(parent) {
        this.parent = parent;
    }

    show(bool) {
        bool = bool === undefined ? true : Boolean(bool);

        this.hidden = bool !== true;
        this.container.classList[this.hidden ? 'add' : 'remove']('hidden');
    }

    trigger(ns, e) {
        if (!ns || !this.triggers[ns]) return;

        const { fn, data } = this.triggers[ns];
        const result = fn.call(this, e);

        // pass result to callback
        if (data && data.constructor === Function) {
            console.log(result, data);
            data.call(this, result);
        }

        return result;
    }

    on(key, re, fn, data) {
        this.triggers[key] = { re, fn, data };
    }

    deselect(selector = 'selected') {
        const array = this.texteditor.querySelectorAll(`.${selector}`);
        [...array].forEach(el => {
            el.classList.remove(selector);
        });
        this.selected = null;
    }

    // setSelected(el = null, newid = null) {
    setSelected(el = null) {
        let { id, innerText } = el;

        // console.log("[%s]", el.innerText.trim(), el);
        // if this element has text then set focus attributes
        if (innerText && innerText.trim()) {
            el.id = id || this.uuid();
            el.classList.add('selected');
            this.selected = el;
        }
    }

    /*

    init method is used to open or create an article.
    - open: document id
    - create: document string

    */
    init(array) {
        // console.log(array);
        if (!array) return;

        const p = new Parse(array);
        this.texteditor.innerHTML = p.toHTML();
        this.show();
    }

    // updates the currently selected element
    // transforms (versions) string array into innerText
    update(array = null) {
        console.log('UPDATE [%s]\n', array, this.selected);

        if (this.selected && array) {
            const { newLine, commentChars } = this.re;

            this.selected.classList.add('locked');
            this.selected.dataset.versions = JSON.stringify(array);

            const innerText = array
                .map(s => {
                    let text = newLine.test(s) ? '\n\n' : s;
                    text = commentChars.test(text) ? '' : text;
                    return text;
                })
                .join(' ')
                .trim();

            this.selected.classList[innerText ? 'remove' : 'add']('empty');
            this.selected[innerText ? 'innerText' : 'innerHTML'] =
                innerText || '(empty)';
        }
    }
}

Texteditor.prototype.load = load;

export default Texteditor;
