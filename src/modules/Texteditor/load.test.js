import load from "./load";

const plainText = `
# Re:writing

Writing is rewriting.

This is a simple tool that allows the writer, to systematically breakdown each paragraph into component sentences, and iterate over new versions until the paragraph is complete.`;

const schema = [
  {},
  {
    text: "# Re:writing"
  },
  {},
  {
    text: "Writing is rewriting."
  },
  {},
  {
    versions: [
      "> This is a crude tool",
      "> A new way to rewrite",
      "This is a simple tool",
      "",
      "that allows",
      "",
      "the writer,",
      "> the student,",
      "> the author",
      "",
      "to systematically breakdown each paragraph into component sentences,",
      "",
      "and iterate over new versions until the paragraph is complete."
    ]
  }
];

test("loads the edit given schema object", () => {
  const data = [].concat(schema); // shallow copy
  const result = load(data);

  expect(load()).toBeNull();
  expect(result).toBeInstanceOf(Array);
  expect(result).toHaveLength(6);
});
