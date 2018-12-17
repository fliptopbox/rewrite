// initial characters that signify line is to be ignored.
const reIgnore = new RegExp("^([>=?!%/:].*|s*)$");

const spaceAfterQuote = /^(\S+)?"\s+/; // eg. `_" `
const spaceBeforeQuote = /\s+"(\S+)?$/; // eg. ` "`

const extractCandidateText = text => {
  // catenate the current candidates and ignore the rest.

  let candidate = text
    .split("\n")
    .map(line => line.trim().replace(reIgnore, ""))
    .filter(value => value.length)
    .join(" ")
    .replace(spaceAfterQuote, '$1"')
    .replace(spaceBeforeQuote, '"$1');

  return candidate;
};

/* QUOKKA inline unit tests * /

const test = `
"
I turn the folded paper over.
> I flip the page over.
> I turn the pagper upside down.

Pinch the corners into a diamond, halve the edges,

pull the long sides into the centre and stop.

"
`;
extractCandidateText(">Rupert\n> Bruce\n\nKilroy\n\nwas here.") //?
extractCandidateText(test) //?

/* end */

export default extractCandidateText;
