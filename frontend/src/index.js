import u from './utilities/';
import React from 'react';
import ReactDOM from 'react-dom';
import Article from './modules/Article';
import Sentences from './modules/Sentences';
import Storage from './modules/Storage/';
import Sidebar from './modules/Sidebar/';

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

const store = new Storage(u.storage.bind(window));
const article = new Article('c1', { prefix: 'a', hidden: true });
const sentences = new Sentences('c2', { prefix: 's', hidden: true });
const articleText = store.initilize();

article.bindTo(sentences);
sentences.bindTo(article);

window.RE = {
    storage: store,
    article: article,
};

(function() {
    setTimeout(() => {
        document.querySelector('.container').classList.remove('hidden');
        document.querySelector('.sidebar').classList.remove('hidden');
        document.querySelector('.overlay').classList.add('hidden');

        // init delay required for scrollIntoViewIfNeeded()
        article.init((articleText && articleText.data) || ['']);
    }, 1950);
})();

// Sidebar is a React component
const sidebar = document.querySelector('#sidebar');
ReactDOM.render(
    <Sidebar
        store={store}
        article={article}
        sentences={sentences}
        mouse={mouse}
    />,
    sidebar
);

// Use react to prevent start-up lag
const overlay = document.querySelector('#overlay');
ReactDOM.render(
    <div className="brand">
        <img src="./static/images/rewriting.svg" alt="writing is rewriting" />
    </div>,
    overlay
);
