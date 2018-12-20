import React from "react";
import u from "../utilities/";

let store;
let fface = 0;
let fsize = 1;

const sizes = [18, 24, 26, 32];
const modifiers = ["serif", "sans-serif", "monospace"];

function setFontFamily(modifier = 0, size = 1, noSave) {
  const body = document.querySelector("body");
  modifiers.forEach(value => body.removeAttribute(value, ""));

  modifier = Math.min(modifier, modifiers.length - 1);
  body.setAttribute(modifiers[modifier], "");

  if (sizes[size]) {
    body.style.fontSize = `${sizes[size]}px`;
  }

  fface = modifier;
  fsize = size;

  store.dispatch({ type: "font-family", value: fface });
  store.dispatch({ type: "font-size", value: fsize });

  if (noSave) return;
  u.storage().write(store.getState());
}

const link = (text, index, args, trim) => {
  const trimmed = trim && text.replace(trim, "");
  return (
    <a
      href="{index}"
      key={index}
      onClick={e => {
        e.preventDefault();
        setFontFamily.apply(this, args);
      }}
    >
      {trim ? trimmed || text : text}
    </a>
  );
};

const FontSizes = () => {
  return sizes.map((value, n) => link(value, n, [fface, n]));
};
const FontFaces = () => {
  return modifiers.map((value, n) =>
    link(value, n, [n, fsize], /(-serif|space)$/i)
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
