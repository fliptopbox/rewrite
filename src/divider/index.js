let state = {
  dragging: false,

  width: 50, // initial ratio (percentage)

  minWidth: 8, // min pixel width
  threshold: 20, // screen width percentage

  vertical: "#vertical",
  document: ".document",
  sentences: ".sentences"
};

let vertical;
let A;
let B;

function settings(key, value) {
  if (!key) return;

  // key, value pairs
  const temp = {};
  if (key.constructor !== Object && value !== undefined) {
    temp[key] = value;
    key = { ...temp };
  }

  state = { ...state, key };
  return state;
}

function resize(e, value) {
  if (!state.dragging && !value) return;

  // prevent cursor selecting during drag
  e && e.stopPropagation && e.stopPropagation();
  e && e.preventDefault && e.preventDefault();
  e && (e.cancelBubble = true);
  e && (e.returnValue = false);

  const { pageX } = e;
  const { threshold, minWidth } = state;
  const { innerWidth } = window;

  let width = value || Number((pageX / innerWidth) * 100);
  width = Math.max(minWidth, width);
  width = Math.min(100 - minWidth, width);

  let percent = width;
  A.classList.remove("hide-content");
  B.classList.remove("hide-content");

  if (width < threshold) {
    // 15 (100-85) (innerWidth - minWidth) / innerWidth
    percent = 100 * (minWidth / innerWidth);
    A.classList.add("hide-content");
  }
  if (width > 100 - threshold) {
    percent = 100 - 100 * (minWidth / innerWidth);
    B.classList.add("hide-content");
  }

  A.style.width = `${percent}%`;
  B.style.width = `${100 - percent}%`;
  vertical.style.left = `${percent}%`;

  state.width = Number(percent);
}

function initialize(options = {}) {
  state = { ...state, options };
  vertical = document.querySelector(state.vertical);
  A = document.querySelector(state.document);
  B = document.querySelector(state.sentences);

  vertical.onmousedown = () => (state.dragging = true);
  vertical.ondblclick = e => resize(e, 50);

  window.onmouseup = () => {
    state.dragging = false;
    console.log("WINDOW [%s]", state.width);
  };

  window.onmousemove = resize;

  resize(state.width);

  return { resize, settings };
}

export default initialize;
