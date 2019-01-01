function textToArray(text = null) {
  // returns simple text Array
  // correcting for double line breaks
  if (!text) return;

  return text.split(/\n/g);
  // return text.replace(/\n\n/g, "\n").split(/\n/g);
}

export default textToArray;
