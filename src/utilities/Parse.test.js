import Parse from "./Parse";

test("ingest plainText and strips trailing whitespace", () => {
  let parse = new Parse("text phrase.");
  expect(parse.toText()).toBe("text phrase.");

  // trailing linebreaks
  parse = new Parse("\n\ntext\n\n\n\n");
  expect(parse.toText()).toBe("\n\ntext");

  // CrLf
  parse = new Parse("\n\r\n\rtext\n\r\n\r\n\r\n\r");
  expect(parse.toText()).toBe("\n\ntext");
});

test("accepts CrLf and returns normalized collection", () => {
  let text = `“Only that you have disarranged our 
little deductions. Your marriage,
you say?”

“Yes, sir. I married, and so left 
the hospital, and with it all hopes of
a consulting practice. It was necessary 
to make a home of my own.”`;

  const p = new Parse(text);
  const collection = p.toCollection();
  expect(collection).toHaveLength(3);
  expect(collection[0]).toHaveProperty("text");
  expect(collection[1]).toEqual({ text: "" });
  expect(collection[2]).toHaveProperty("text");
});

test("returns unwrapped text", () => {
  const text = "\n\nalpha.\nbravo charlie.\n\ndelta echo foxtrot.\n\n";
  const string = "\n\nalpha. bravo charlie.\n\ndelta echo foxtrot.";

  const p = new Parse(text);
  const result = p.toText();
  expect(result).toBe(string);
});
