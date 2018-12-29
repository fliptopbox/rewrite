import { dispatch, subscribe } from "./functions";

import u from "./utilities";
import initialize from "./editor";
import collectionToHtml from "./editor/collectionToHtml";

import "./styles.scss";

const messages = {
  confirmDelete: `
    You are unlocking this paragraph. 

    This will delete the working versions and destill 
    the paragraph to the currently elected candidate.

    CANCEL to keep working versions
    OK to discard versions`
};

const editor = initialize("#sentences", {
  autoTerminate: false
});

// load some text into the DOM
let $focusOn; // current node element
const $doc = document.querySelector("#document");
const sample = require("./editor/startup.json");
const local = u.storage().read();

function save($els) {
  // parse DOM to collection
  // save to localstrorage

  const collection = [...$els].map(el => {
    const { innerText = "", dataset } = el;
    const versions = (dataset.versions && JSON.parse(dataset.versions)) || "";
    return { text: innerText, versions: versions };
  });

  u.storage().write(collection);
}

function updateParent(e) {
  const { candidate, versions } = e.detail;
  // document.querySelector("#article").innerHTML = candidate;
  // document.querySelector("#versions").innerHTML = JSON.stringify(versions);

  if ($focusOn) {
    $focusOn.innerText = candidate;
    $focusOn.dataset.versions = JSON.stringify(versions);
    save(document.querySelector("#document").children);
  }
}

// Initial DOM injection
$doc.innerHTML = collectionToHtml(local || sample);

// Passive events from Editor changes
editor.onChange((candidate, versions) =>
  dispatch("updateparent", { candidate, versions })
);

subscribe("updateparent", updateParent);

// Acive DOM interaction Events
document.querySelector("#document").ondblclick = e => {
  e.target.id = e.target.id || u.uuid();
  let { id, innerText, dataset } = e.target;
  const { versions } = dataset;

  if (versions) {
    // confirm delete
    if (!window.confirm(messages.confirmDelete)) return;

    // first clear editor
    editor.clear();

    // next ... remove DOM reference
    $focusOn.id = "";
    $focusOn = null;

    // next cleanup this
    e.target.className = "";
    e.target.id = "";
    e.target.dataset.versions = "";

    // update local storage
    console.log("toggle off", $focusOn);
    return;
  }

  const text = u.inflate(innerText);
  const value = (versions && JSON.parse(versions)) || text || "";

  $focusOn = document.querySelector(`#${id}`);
  $focusOn.className = "locked selected";

  editor.load(value);
};

document.querySelector("#document").onclick = e => {
  // de-select any existing nodes
  const selected = document.querySelector(".selected");
  selected && selected.classList.remove("selected");

  // only load locked nodes
  let { id, dataset } = e.target;
  if (!id || !dataset.versions) return;

  console.log(333, e.target);
  $focusOn = document.querySelector(`#${id}`);
  $focusOn.classList.add("selected");

  editor.load(JSON.parse(dataset.versions));
};

const state = {
  dragging: false,
  width: 50
};

const vertical = document.querySelector("#vertical");
const A = document.querySelector(".document");
const B = document.querySelector(".sentences");

function resize(e, value) {
  if (!state.dragging && !value) return;

  if (e.stopPropagation) e.stopPropagation();
  if (e.preventDefault) e.preventDefault();
  e.cancelBubble = true;
  e.returnValue = false;

  const { pageX } = e;

  let width = value || Number((pageX / window.innerWidth) * 100);
  width = Math.max(1, width);
  width = Math.min(99, width);

  let percent = width;
  A.classList.remove("hide-content");
  B.classList.remove("hide-content");

  if (width < 15) {
    percent = 0.5;
    A.classList.add("hide-content");
  }
  if (width > 85) {
    percent = 99.5;
    B.classList.add("hide-content");
  }

  A.style.width = `${percent}%`;
  B.style.width = `${100 - percent}%`;
  vertical.style.left = `${percent}%`;

  state.width = percent;
}

vertical.onmousedown = () => (state.dragging = true);
vertical.ondblclick = e => resize(e, 50);

window.onmouseup = () => (state.dragging = false);
window.onmousemove = resize;
