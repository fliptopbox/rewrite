import React from "react";
import u from "../utilities/";

let store;
let fface = 0;
let fsize = 1;

function setFontFamily(modifier = 0, size = 1, noSave) {
  const body = document.querySelector("body");
  const modifiers = ["serif", "sanserif", "monospace"];
  const sizes = [14, 18, 24, 26];
  modifiers.forEach(value => body.removeAttribute(value, ""));

  modifier = Math.min(modifier, modifiers.length - 1);
  body.setAttribute(modifiers[modifier], "");

  if (sizes[size]) {
    body.style.fontSize = `${sizes[size]}px`;
  }

  fface = modifier;
  fsize = size;

  if (noSave) return;

  store.dispatch({ type: "font-family", value: fface });
  store.dispatch({ type: "font-size", value: fsize });

  u.storage().write(store.getState());
}

const FontSizes = () => {
  return (
    <ul>
      <a href="#0" onClick={() => setFontFamily(fface, 0)}>
        14
      </a>
      <a href="#1" onClick={() => setFontFamily(fface, 1)}>
        18
      </a>
      <a href="#2" onClick={() => setFontFamily(fface, 2)}>
        24
      </a>
      <a href="#3" onClick={() => setFontFamily(fface, 3)}>
        26
      </a>
    </ul>
  );
};
const FontFaces = () => {
  return (
    <ul>
      <a href="#0" onClick={() => setFontFamily(0)}>
        Serif
      </a>
      <a href="#1" onClick={() => setFontFamily(1)}>
        Sans
      </a>
      <a href="#2" onClick={() => setFontFamily(2)}>
        Mono
      </a>
    </ul>
  );
};

export default props => {
  store = store || props.store;
  const { fontFamily, fontSize } = store.getState().settings;
  setFontFamily(fontFamily, fontSize, true);
  return (
    <div>
      <FontFaces />
      <FontSizes />
    </div>
  );
};
