function textToArray(text = null) {
  // returns simple text Array
  // correcting for double line breaks
  if (!text) return;

  return text.replace(/\n\n/gm, "\n").split(/\n/g);
}

export default textToArray;
