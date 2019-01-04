import SBD from "sbd";

function inflate(text) {
  // returns sentences broken into lines
  const array = SBD.sentences(text);
  return array.join("\n");
}

export default inflate;
