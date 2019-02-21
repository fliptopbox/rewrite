import u from '../utilities';

let A;
let B;
// let action;
let vertical;
let dragging = false;
const { read, write } = u.storage('settings');

let state = Object.assign(
    {},
    {
        width: 50, // initial ratio (percentage)
        minWidth: 10, // min pixel width
        threshold: 15, // screen width percentage

        // DOM fixtures
    },
    read()
);

function save(obj = {}) {
    const prev = read(); // remember Controller also saves settings
    const data = { ...state, ...prev, ...obj };
    write(data);
    return data;
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

const elements = {};
function update(id, text) {
    elements[id].innerText = text;
    console.log('divider update [%s]', text, id);
}

function add(id) {
    const div = document.createElement('div'); // Create a text node
    div.id = id;
    div.className = `divider-${id}`;
    vertical.appendChild(div); // Append the text to <li>
    elements[id] = div;
}

function initialize(options = {}) {
    const body = document.querySelector('body');
    let showsidebar = body.classList.contains('show-sidebar');
    const zone = [3, 500]; // mouse trigger region

    vertical = document.querySelector('#vertical');
    A = document.querySelector('.paragraphs');
    B = document.querySelector('.sentences');

    vertical.onmousedown = () => (dragging = true);
    vertical.ondblclick = e => resize(e, 50);

    window.onmouseup = () => (dragging = false);
    window.onmousemove = e => {
        const { pageX } = e;
        resize(e);

        // sidebar stuff
        showsidebar = body.classList.contains('show-sidebar');
        if (pageX > zone[1]) {
            return body.classList.remove('show-sidebar');
        }

        if (pageX < zone[0] || (showsidebar && pageX < zone[1])) {
            body.classList.add('show-sidebar');
            u.defer(
                'sidebar',
                () =>
                    pageX > zone[1]
                        ? body.classList.remove('show-sidebar')
                        : null,
                500
            );
        }
    };

    // save(options);
    resize(null, state.width);

    console.log('resizer initialized');

    return { resize, settings, add, update };
}

export default initialize;
