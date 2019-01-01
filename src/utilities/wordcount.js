function wordcount(value) {
  return value
    .replace(/[\.\n]+/g, "")
    .replace(/(\s\s+)/g, "")
    .split(" ").length;
}

export default wordcount;
