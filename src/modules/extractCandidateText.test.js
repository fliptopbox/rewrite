import extractCandidateText from "./extractCandidateText";

test("string", () => {
  let text;
  let result;
  expect(extractCandidateText("string")).toBe("string");
  expect(extractCandidateText(">string")).toBe("");

  text = "Ut laborum id commodo irure.\n> cupidatat deserunt laborum sunt.";
  result = "Ut laborum id commodo irure.";
  expect(extractCandidateText(text)).toBe(result);

  text = '_"Italic Quotes"_\n\nLine one active\n> Line two hidden\n\n';
  result = '_"Italic Quotes"_ Line one active';
  expect(extractCandidateText(text)).toBe(result);

  text = '"\nMultiline Quote\n\nLine one active\n> Line two hidden\n\n"';
  result = '"Multiline Quote Line one active"';
  expect(extractCandidateText(text)).toBe(result);
});
