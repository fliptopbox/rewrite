import React from "react";

let dragging = false;
let $content;
let $editor;

const min = 15; // minimum screen width as percentage

const setWidth = (n = 50, force) => {
  if (!force && !dragging) return;

  $content = $content || document.querySelector(".content");
  $editor = $editor || document.querySelector(".editor");

  n = Math.max(min, n);
  n = Math.min(100 - min, n);

  $content.style.width = `${n}%`;
  $editor.style.width = `${100 - n}%`;
};

window.onmouseup = () => (dragging = false);
window.onmousemove = e => setWidth((e.pageX / window.innerWidth) * 100);

const Resizer = () => {
  return (
    <span
      id="resizer"
      className="resizer"
      onMouseDown={() => (dragging = true)}
      onDoubleClick={() => setWidth(50, true)}
    >
      {"|||"}
    </span>
  );
};

export default Resizer;
