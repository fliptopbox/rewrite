const re = {
  lineEnd: /(^\w|[\.\?\!]\s+\w)/g,
  newLine: /^-{3,}/,
  commentChars: /^(\s+)?[>?!/]+(\s+)?/,
  passiveKeys: /^(arrow|shift|control|alt|tab)/i
};

const options = {
  flag: "inactive",
  re: /^(\s+)?[>?!/]+(\s+)?/,
  tag: "p",
  br: "<br/>"
};

const timer = {
  default: 100,
  delay: 0
};

export default {
  re,
  options,
  timer
};
