function unwrap(text = "", exceptions) {
  // unwrap hardline breaks.
  let catenated = text;
  catenated = catenated.split(/\n{2,}/gm);
  catenated = catenated.map(s =>
    exceptions ? processline(s, exceptions) : catenate(s)
  );

  // normalize the paragraph breaks
  catenated = catenated.join("\n\n");
  catenated = catenated.split(/\n/g);

  return [...catenated];
}

function catenate(text) {
  return (
    text
      .replace(/\n+/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim() || ""
  );
}

function processline(text, exceptions) {
  let string = "";
  text.split(/\n/g).forEach(line => {
    const txt = String(line || "").trim();
    const test = exceptions.some(re => re.test(txt));
    if (!txt) return;
    string += test ? `\n${txt}\n` : `${txt} `;
  });
  return string.replace(/\n{2,}/, "\n").trim();
}

export default unwrap;

/** * /
let text;

text = `
            CHARACTER (V.O)
        (parenthesis)
    Alpha beta charlie delta echo
    foxtro. Golf hotel indigo juliet
        (more wrylys)
    Kilo lima mama niner oscar papa
    quebec romeo sierra tango uniform
    violet whiskey exray zebra.
`;

unwrap(text); //?
unwrap(text, [/^[^a-z]+$/, /^\(.*\)$/]); //?

/** */
