import sbd from "sbd";
import { dispatch, subscribe } from "./functions";
import initialize from "./editor";
import u from "./utilities";

import "./styles.scss";

let $focusOn;

const messages = {
  confirmDelete: `
    You are unlocking this paragraph. 

    This will delete the working versions and destill 
    the paragraph to the currently elected candidate.

    CANCEL to keep working versions
    OK to discard versions`
};

const editor = initialize("#sentences", {
  autoTerminate: true,
  prefixToken: "// "
});

editor.onChange((candidate, versions) =>
  dispatch("updateparent", { candidate, versions })
);

// load some text into the DOM
const $doc = document.querySelector("#document");

$doc.innerHTML = `
      <div>Lorem Ipsum 11 word. Lorem Ipsum 12 word. Lorem Ipsum 13 word.</div>
      <div><br /></div>
      <div>Lorem Ipsum 21 word. Lorem Ipsum 22 word. Lorem Ipsum 23 word.</div>
      <div><br /></div>
      <div><br /></div>
      <div><br /></div>
      <div>Lorem Ipsum 31 word. Lorem Ipsum 32 word. Lorem Ipsum 33 word.</div
`;

subscribe("updateparent", e => {
  console.log("UPDATE-PARENT:", e.detail, e);
  const { candidate, versions } = e.detail;
  document.querySelector("#article").innerHTML = candidate;
  document.querySelector("#versions").innerHTML = JSON.stringify(versions);

  if ($focusOn) {
    $focusOn.innerText = candidate;
    $focusOn.dataset.versions = JSON.stringify(versions);
  }
});

// document.getElementById("app").innerHTML = ``;

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
  $focusOn.classList.add("locked");

  editor.load(value);
};
