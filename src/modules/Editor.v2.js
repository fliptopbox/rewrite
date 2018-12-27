let editor;

const re_comment_prefix = new RegExp("^[>]s?", "g");

const config = {
  resetDelay: 750,
  doubleTap: 200
};

function textToArray(text) {
  // returns simple text Array
  // correcting for double line breaks

  return text.replace(/\n\n/gm, "\n").split(/\n/g);
}

// ["Lorem ipsum 1","Lorem ipsum 2","> Lorem ipsum 4","","Lorem ipsum 3"]
textToArray(""); //?

function arrayToHtml(array) {
  // returns DOM string
  // parse comment chars to className "comment"

  return [...array].map(text => {
    const className = re_comment_prefix.test(text) ? `class="comment"` : "";
    const value = text ? text.replace(re_comment_prefix, "").trim() : "<br />";

    return `<div ${className}>${value}</div>`;
  });
}

var a = arrayToHtml([
  "Lorem ipsum 1",
  "Lorem ipsum 2",
  "> Lorem ipsum 4",
  "",
  "Lorem ipsum 3"
]);
a;

function load(string = "") {
  if (!editor) init();
  const array = textToArray(string);
  const html = arrayToHtml(array);
  editor.innerHTML = html;
}

function toggleComment(bool) {
  var line = document.getSelection().focusNode.parentNode;
  var text = line.innerText;
  var skip = !/div/i.test(line.nodeName) || !text || !text.trim();

  if (skip) return;

  line.classList.toggle("comment");
}

function executeTriggers(e, keyTime, keyHistory) {
  const { parentNode } = window.getSelection().focusNode;
  console.log("parent", parentNode);
}

function bindEvents() {
  let ts = 0;
  let hist = [];

  editor.onkeyup = e => {
    const { doubleTap, resetDelay } = config;
    const diff = e.timeStamp - ts;
    const delay = diff < doubleTap;
    ts = e.timeStamp;

    if (diff > resetDelay) {
      hist = [];
    }

    hist.push(e.key);
    hist = hist.slice(-5);

    executeTriggers(e, delay, hist);
  };
}

function init($elm, options = {}) {
  editor = $elm || editor || document.querySelector("#textBox");
  bindEvents();
}

export default { load };
