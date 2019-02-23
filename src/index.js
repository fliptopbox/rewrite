import u from './utilities/';
import React from 'react';
import ReactDOM from 'react-dom';
import Article from './modules/Article';
import Sentences from './modules/Sentences';
// import Controller from "./modules/Controller";
import Storage from './modules/Storage/';
import Parse from './utilities/Parse';
import Sidebar from './modules/Sidebar/';
import dividerinit from './modules/divider';

// import PubSub from "pubsub-js";

// import buttons from "./modules/uibuttons";
import './styles.scss';

const mouseEvents = {
    up: [],
    move: [],
};

function mouse(e, method, fn) {
    if (fn) return mouseEvents[method].push(fn);
    mouseEvents[method].forEach(callback => callback(e));
}

window.onmouseup = e => mouse(e, 'up');
window.onmousemove = e => mouse(e, 'move');

let divider;
const store = new Storage(u.storage.bind(window));
const article = new Article('c1', { prefix: 'a', hidden: true });
const sentences = new Sentences('c2', { prefix: 's', hidden: true });
// const ctrl = new Controller();

article.on('after', null, saveToDisk);
sentences.on('after', null, saveToDisk);

article.bindTo(sentences);
sentences.bindTo(article);

const articleText = store.initilize();
article.init(articleText.data);

window.RE = {
    storage: store,
    article: article,
};

const startup = (function() {
    setTimeout(() => {
        document.querySelector('.container').classList.remove('hidden');
        document.querySelector('.overlay').classList.add('hidden');
        divider = dividerinit(mouse);
        divider.add('wordcount');
    }, 950);
    return Function;
})();

// Sidebar is a React component
const sidebar = document.querySelector('#sidebar');
ReactDOM.render(
    <Sidebar store={store} article={article} mouse={mouse} />,
    sidebar
);

// Use react to prevent start-up lag
const overlay = document.querySelector('#overlay');
ReactDOM.render(
    <div className="brand">
        <img src="./rewriting.svg" alt="writing is rewriting" />
    </div>,
    overlay
);

startup();

/*
 * some UI buttons need links to objects defined
 * outside the loader script, for example:
 * the Article instance or the store Object
 *
 * These late bindings are handled here ...
 * the default UI buttons (array) is updated
 * to assign the callbacks with instance references
 *
 */

function saveToDisk() {
    const children = article.texteditor.children;
    const data = new Parse(children).toCollection();
    store.write(data);

    // update wordcount
    updateWordCount(article.texteditor);
}

function updateWordCount(el) {
    return u.defer(
        'wordcount',
        () => {
            const text = el.innerText;
            const wordcount = u.wordcount(text);
            divider.update('wordcount', wordcount);
        },
        500
    );
}
