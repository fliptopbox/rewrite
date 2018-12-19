import React from "react";
import u from "../utilities/";

let dragging = false;
let $content;
let $editor;
let store;

const min = 15; // minimum screen width as percentage

const setWidth = (n = 50, force) => {
  if (!force && !dragging) return;

  $content = $content || document.querySelector(".content");
  $editor = $editor || document.querySelector(".editor");

  n = Math.max(min, n);
  n = Math.min(100 - min, n);

  $content.style.width = `${n}%`;
  $editor.style.width = `${100 - n}%`;

  store.dispatch({
    type: "panel-width",
    value: n
  });
  u.storage().write(store.getState());
};

window.onmouseup = () => (dragging = false);
window.onmousemove = e => setWidth((e.pageX / window.innerWidth) * 100);

const Resizer = props => {
  store = props.store;
  const width = store.getState().settings.panelWidth;
  setTimeout(() => setWidth(width || 70, true), 0);
  return ( <
    span id = "resizer"
    className = "resizer"
    onMouseDown = {
      () => (dragging = true)
    }
    onDoubleClick = {
      () => setWidth(50, true)
    } >
    {
      "|||"
    } <
    /span>
  );
};

export default Resizer;