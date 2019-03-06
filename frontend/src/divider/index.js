import u from '../utilities';

let A;
let B;
let action;
let vertical;
let dragging = false;
const { read, write } = u.storage('resizer');

let state = Object.assign(
    {},
    {
        width: 50, // initial ratio (percentage)
        minWidth: 8, // min pixel width
        threshold: 20, // screen width percentage

        // DOM fixtures
        vertical: '#vertical',
        document: '.document',
        sentences: '.sentences',
    },
    read()
);

function save(obj = {}) {
    const data = { ...state, ...obj };
    write(data);
    return obj;
}

function settings(key, value) {
    if (!key) return state;

    // key, value pairs
    const temp = {};
    if (key.constructor !== Object && value !== undefined) {
        temp[key] = value;
        key = { ...temp };
    }

    state = { ...state, key };
    return save(state);
}

function resize(e, value) {
    if (!dragging && !value) return;

    let { pageX } = e || {};

    if (e) {
        // prevent cursor selecting during drag
        e.stopPropagation && e.stopPropagation();
        e.preventDefault && e.preventDefault();
        e.cancelBubble = true;
        e.returnValue = false;
    }

    const { threshold, minWidth } = state;
    const { innerWidth } = window;

    pageX = pageX || ((value || 50) / 100) * innerWidth;
    let width = value || Number((pageX / innerWidth) * 100);
    width = Math.max(minWidth, width);
    width = Math.min(100 - minWidth, width);

    let percent = width;
    A.classList.remove('hide-content');
    B.classList.remove('hide-content');
    vertical.classList.remove('hide-menu-left');
    vertical.classList.remove('hide-menu-right');

    if (width < threshold) {
        // 15 (100-85) (innerWidth - minWidth) / innerWidth
        percent = 100 * (minWidth / innerWidth);
        A.classList.add('hide-content');
        vertical.classList.add('hide-menu-left');
    }
    if (width > 100 - threshold) {
        percent = 100 - 100 * ((minWidth * 1.5) / innerWidth);
        B.classList.add('hide-content');
        vertical.classList.add('hide-menu-right');
    }

    A.style.width = `${percent}%`;
    B.style.width = `${100 - percent}%`;
    vertical.style.left = `${percent}%`;

    save({ width: Number(percent) });
}

function bindMenuEvents() {
    action.onclick = e => {
        const { nodeName, dataset, parentNode } = e.target;
        const { article } = window.RE;
        const fn = dataset.fn;
        let index;
        let context;

        if (nodeName !== 'LI') return;
        context = parentNode.className.match(/(left|right)/);

        switch (fn) {
            case 'close':
            case 'middle':
                const widths = [1, 50, 99];
                index = fn === 'middle' ? 1 : null;
                index = index || (context[0] === 'left' ? 0 : 2);
                console.log(fn, index, widths[index], context[0]);

                resize(null, widths[index]);
                save({ width: widths[index] });

                break;

            case 'center':
                const elm = document.querySelector('.selected');
                elm && elm.scrollIntoViewIfNeeded();
                break;

            case 'name':
                const name = '';
                const value = prompt('Enter new name', name);
                article.meta('name', value);
                break;

            case 'unwrap':
            case 'unstrike':
            case 'wordcount':
                const classnames = ['un-wrap', 'un-strike', 'wordcount'];
                index = ['unwrap', 'unstrike', 'wordcount'].indexOf(fn);

                const classvalue = classnames[index];
                document
                    .querySelector('#sentences')
                    .classList.toggle(classvalue);
                break;

            case 'list':
                const ids = article.list();
                const list = article.list(true);
                index = Number(prompt(list));
                article.load(ids[index]);
                break;

            case 'delete':
                window.RE.article.delete();
                break;

            case 'read':
                triggers['read'] && triggers['read']();
                break;

            default:
                window.RE.article[fn](e);
                break;
        }
    };
}

const triggers = {};
function delegate(key, fn) {
    triggers[key] = fn;
}

function initialize(options = {}) {
    vertical = document.querySelector(state.vertical);
    action = document.querySelector('.divider');
    A = document.querySelector(state.document);
    B = document.querySelector(state.sentences);

    bindMenuEvents();

    vertical.onmousedown = () => (dragging = true);
    vertical.ondblclick = e => resize(e, 50);

    window.onmouseup = () => (dragging = false);
    window.onmousemove = resize;

    save(options);
    resize(null, state.width);

    console.log('resizer initialized');

    return { resize, settings, delegate };
}

export default initialize;
