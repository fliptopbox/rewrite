function fontFamily(modifier = 0, size = 0) {
  const body = document.querySelector("body");
  const modifiers = ["serif", "sanserif", "monospace"];
  modifiers.forEach(value => body.removeAttribute(value, ""));

  modifier = Math.min(modifier, modifiers.length - 1);
  body.setAttribute(modifiers[modifier], "");

  if (size && Number(size) >= 14) {
    body.style.fontSize = `${size}px`;
  }
}

export default fontFamily;
