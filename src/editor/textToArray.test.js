import textToArray from "./textToArray";

test("Test the array", () => {
  let text;

  text = "# Heading\n\nA line of text.\n\nEnd";
  expect(textToArray(text)).toHaveLength(5);

  // CrLf linebreak characters
  text = "# Heading\r\n\r\nA line of text.\r\n\r\nEnd";
  expect(textToArray(text)).toHaveLength(5);

  // Irregular linebreak characters
  text = "# Heading\n\n\rA line of text.\r\n\n\rEnd";
  expect(textToArray(text)).toHaveLength(5);

  text = `# Heading

   A line of text.
   A line of text.

   End.`;
  expect(textToArray(text)).toHaveLength(5);

  text = JSON.stringify(text);
  text = JSON.parse(text);
  expect(textToArray(text)).toHaveLength(5);
});

test("unwrap multiline text document", () => {
  let text;
  text = `Dr. Mortimer blinked through his glasses in mild astonishment. “Why was
    it bad?”

    “Only that you have disarranged our little deductions. Your marriage,
    you say?”

    “Yes, sir. I married, and so left the hospital, and with it all hopes of
    a consulting practice. It was necessary to make a home of my own.”

    “Come, come, we are not so far wrong, after all,” said Holmes. “And now,
    Dr. James Mortimer--”`;

  expect(textToArray(text)).toHaveLength(7);

  text = `Dr. Mortimer blinked through his 
    glasses in mild astonishment. “Why was
    it bad?”

    “Only that you have disarranged our 
    little deductions. Your marriage,
    you say?”

    “Yes, sir. I married, and so left 
    the hospital, and with it all hopes of
    a consulting practice. It was necessary 
    to make a home of my own.”

    “Come, come, we are not so far wrong, 
    after all,” said Holmes. “And now,
    Dr. James Mortimer--”`;

  expect(textToArray(text)).toHaveLength(7);
});
