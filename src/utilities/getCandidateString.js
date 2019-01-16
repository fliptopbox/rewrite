import terminate from "./terminate";
import textToArray from "./textToArray";

const re_comments = /^([\/\>\?\=\!]\s*?)/;

function getCandidateString(value, autoTerminate = false) {
  // recieve String or Array
  // returns string
  // parse the DOM elements to simple Array

  const is_array = value && value.constructor === Array;
  const array = is_array ? value : textToArray(value);
  return [...array]
    .map(line =>
      re_comments.test(line) ? null : terminate(line, autoTerminate)
    )
    .filter(s => s && s.length)
    .join(" ")
    .trim();
}

export default getCandidateString;
