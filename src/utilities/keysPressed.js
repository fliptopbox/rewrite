function keyCombination(e) {
  let { altKey, shiftKey, ctrlKey, code, key } = e;

  const matrix = [
    ctrlKey ? "CTRL" : undefined,
    shiftKey ? "SHIFT" : undefined,
    altKey ? "ALT" : undefined,
    (key.trim() || code || "").toLowerCase()
  ]
    .filter(val => val)
    .join("");

  return matrix;
  // const down = `${ctrlKey}${shiftKey}${altKey}${key.toLowerCase()}`;
}

// const e = {
//     altKey: true,
//     key: " ",
//     code: "Space",
//     ctrlKey: true
// }

// keyTriggers(e); //?

export default keyCombination;
