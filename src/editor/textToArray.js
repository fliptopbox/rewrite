function textToArray(plaintext = null) {
  // returns simple text Array
  // correcting for double line breaks
  // and removing hard line breaks.

  if (!plaintext) return;

  let catenated = plaintext.trim();

  // remove carridge returns (aka CrLf => Lf)
  if (/\r/.test(plaintext)) catenated = catenated.replace(/\r/gm, "");

  // unwrap hardline breaks.
  catenated = catenated.split(/\n{2,}/gm);
  catenated = catenated.map(
    s =>
      s
        .replace(/\n+/g, " ")
        .replace(/\s{2,}/g, " ")
        .trim() || ""
  );

  // normalize the paragraph breaks
  catenated = catenated.join("\n\n");
  catenated = catenated.split(/\n/g);

  return [...catenated];
}

/** quokka inline test * /
textToArray("one\ntwo\n\nthree"); //?
/** */

export default textToArray;
