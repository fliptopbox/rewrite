// import marked from 'marked';
// import markdown from '../../utilities/markdown';
import bindEvents from './bindEvents';
import config from '../../config';
import arrayToHtml from './arrayToHtml';
import defer from '../../utilities/defer';
import uuid from '../../utilities/uuid';
import inflate from '../../utilities/inflate';
import updateKeysPressed from './updateKeysPressed';
import Parse from '../../utilities/Parse';
import wordcount from '../../utilities/wordcount';
import arrayToCollection from '../../utilities/arrayToCollection';
import scrollIntoViewIfNeeded from '../../utilities/scrollIntoViewIfNeeded';
import readability from 'readability-meter';

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
        this.markdown = null;
        this.scrollToSelected = true;
        this.words = 0;
        this.wordtarget = 0;
        this.showReadability = true;

        this.container = container;
        this.texteditor = texteditor;
        this.data = {};

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
            wordcounter: { fn: function() {} },
        };

        // import external config settings
        Object.assign(this, config, options);

        let { hidden = false } = this;

        // external modules
        bindEvents.bind(this)();
        this.defer = defer.bind(this);
        this.uuid = uuid.bind(this);
        this.arrayToHtml = arrayToHtml.bind(this);
        this.updateKeysPressed = updateKeysPressed.bind(this);

        // extends Mozilla with polyfill methods
        if (Element && !Element.scrollIntoViewIfNeeded) {
            scrollIntoViewIfNeeded();
        }

        // and lastly ... instanate
        this.init();
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
        // if markdown is asctive, render it
        // if (this.markdown) {
        //     console.log('render markdown');
        // }
        const array = this.texteditor.querySelectorAll(`.${selector}`);
        [...array].forEach(el => el.classList.remove(selector));
        this.selected = null;
    }

    setSelected(el = null) {
        let { id, innerText } = el;

        // console.log('[%s]', el.innerText.trim(), el);
        // if this element has text then set focus attributes

        if (!innerText || !innerText.trim()) {
            console.warn('Element has no innerText value');
            return;
        }

        el.id = id || this.uuid();
        el.classList.add('selected');

        // if there is a version array, lock it
        const locked = el.dataset && el.dataset.versions;
        const method = locked ? 'add' : 'remove';
        el.classList[method]('locked');

        // if markdown is active ...
        // if (this.markdown) {
        //     console.log('restore RAW text data');
        // }

        this.selected = el;
    }

    focus() {
        // if there is a selected element ...
        // scroll to that element
        let el = this.selected;
        if (this.scrollToSelected && el) el.scrollIntoViewIfNeeded();
    }

    toggleMarkdown() {
        this.markdown = false;
    }

    wordcounter = fn => {
        this.defer.call(
            this,
            'wordcounter',
            () => {
                fn = fn || this.triggers.wordcounter.fn;
                let diff;
                const el = document.createElement('span');
                const p = new Parse(this.texteditor.children);

                //const { innerText } = this.texteditor;
                const innerText = p.toText();

                el.classList.add('value');
                this.words = wordcount(innerText);
                el.innerHTML = this.words;

                if (this.wordtarget) {
                    diff = this.wordtarget - this.words;
                    let warn = diff < 0 ? '-warn' : '';

                    el.classList.add(`value${warn}`);
                    el.innerHTML = `${this.words}/${this.wordtarget}`;
                }

                if (this.showReadability) {
                    let { score } = readability.ease(innerText);
                    score = parseInt(score, 10);
                    el.innerHTML = `${el.innerHTML} (${score}%)`;
                }
                return fn(el.outerHTML);
            },
            150
        );
    };
    /*
    init method is used to open or create an article.
    this method will also try to populate the related
    Sentence instanate with content.
    */
    init = array => {
        // console.log(array);
        if (!array) return;

        const p = new Parse(array, { markdown: this.markdown });
        this.texteditor.innerHTML = p.toHTML();

        this.show();
        this.wordcounter();

        const selected = this.texteditor.querySelector('.selected');
        let sentence = null;

        if (!selected) return;

        // give the DOM time to render, then focus on selected.
        setTimeout(() => this.focus(), 850);

        // activate current element and inject sentence data
        this.setSelected(selected);

        // it might be locked or not .... get an Array
        sentence = selected.dataset.versions
            ? JSON.parse(selected.dataset.versions)
            : inflate(selected.innerText);

        this.parent.init(sentence);
    };

    setWordTarget(n = 0) {
        this.wordtarget = n;
    }

    reset(data) {
        // clear the text editor
        // clear selected element
        // clear related editors
        this.parent.texteditor.innerText = '';
        this.texteditor.innerText = '';
        this.parent.selected = null;
        this.selected = null;
        this.words = 0;
        // this.wordtarget = 0;
        this.data = {};

        // backward compatability
        if (data.meta) {
            console.warn('Reduce article to data', data);

            const { wordtarget = null } = data.meta;
            this.wordtarget = wordtarget;

            data = data.data;
        }

        this.init(data);
    }

    // updates the currently selected element
    // transforms (versions) string array into innerText
    // this is called when the Sentence updates the Paragrpah
    update(array = null) {
        console.log('UPDATE [%s]\n', array, this.markdown);

        const { selected } = this;
        const { newLine, commentChars } = this.re;

        if (!selected || !array) return;

        // ensure the parent node is up-to-date
        selected.dataset.versions = JSON.stringify(array);

        // with the sentences catenate the paragraph innerText
        // ignore commented lines, and modify empty lines.
        let text = array
            .map(s => {
                let txt = newLine.test(s) ? '\n\n' : s;
                txt = commentChars.test(txt) ? '' : txt;
                return `${txt}`.trim();
            })
            .filter(s => s && s.trim())
            .join(' ')
            .trim();

        // remove markdown classNames
        [...selected.classList].forEach(
            m => /^md/.test(m) && selected.classList.remove(m)
        );

        // render markdown paragraph and add new classNames
        if (this.markdown && text) {
            const obj = arrayToCollection([text], commentChars, true)[0];
            selected.dataset.text = text;
            text = obj.html || '';

            if (obj.classnames && obj.classnames.length) {
                obj.classnames.forEach(name => selected.classList.add(name));
            }
        }

        // if there is no text, then mark the row & inject (empty)
        selected.classList[text ? 'remove' : 'add']('empty');
        selected.classList.add('locked');
        selected.classList.add('selected');
        selected.innerHTML = text || `(empty)`;

        // this.parent.wordcount();

        return selected;
    }
}

export default Texteditor;
