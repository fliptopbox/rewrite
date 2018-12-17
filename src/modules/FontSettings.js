import React from "react";
let fface = 0;
let fsize = 1;

function fontFamily(modifier = 0, size = 1) {
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
}

const FontSizes = () => {
  return (
    <ul>
      <a href="#0" onClick={() => fontFamily(fface, 0)}>
        14
      </a>
      <a href="#1" onClick={() => fontFamily(fface, 1)}>
        18
      </a>
      <a href="#2" onClick={() => fontFamily(fface, 2)}>
        24
      </a>
      <a href="#3" onClick={() => fontFamily(fface, 3)}>
        26
      </a>
    </ul>
  );
};
const FontFaces = () => {
  return (
    <ul>
      <a href="#0" onClick={() => fontFamily(0)}>
        Serif
      </a>
      <a href="#1" onClick={() => fontFamily(1)}>
        Sans
      </a>
      <a href="#2" onClick={() => fontFamily(2)}>
        Mono
      </a>
    </ul>
  );
};

export default () => {
  return (
    <div>
      <FontFaces />
      <FontSizes />
    </div>
  );
};
