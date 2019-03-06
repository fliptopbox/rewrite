import SBD from "sbd";

function inflate(text, asarray = false) {
  // returns sentences broken into lines
  const array = SBD.sentences(text);
  return asarray ? array : array.join("\n");
}

export default inflate;
