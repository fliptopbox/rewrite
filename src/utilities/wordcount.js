function wordcount(value) {
  value = String(value || "");

  if (!value) return 0;

  value = value
    .replace(/\-{2,}/g, "")
    .replace(/[\"\.\n]+/g, " ")
    .replace(/(\s{1,})/g, " ")
    .trim();

  return value.length ? value.split(" ").length : 0;
}

export default wordcount;
