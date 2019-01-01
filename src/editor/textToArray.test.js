import textToArray from "./textToArray";

test("Test the array", () => {
  let text;

  text = "# Heading\n\nA line of text.\n\nEnd";
  expect(textToArray(text)).toHaveLength(5);

  text = `# Heading

   A line of text.

   End.`;
  expect(textToArray(text)).toHaveLength(5);

  text = JSON.stringify(text);
  text = JSON.parse(text);
  expect(textToArray(text)).toHaveLength(5);
});
