import wordcount from "./wordcount";

test("correctly calculates the word count", () => {
  let words = `
  "one two. three four five. six. " 
  seven. 8. nine ""
                             ten
  eleven ...
  

  
  tweleve-tweleve-tweleve --- ."
  `;

  expect(wordcount()).toBe(0);
  expect(wordcount(null)).toBe(0);
  expect(wordcount("one ... two")).toBe(2);
  expect(wordcount("\n\n\n\n\n\n\n")).toBe(0);
  expect(wordcount("\n\n\n     \n\n\n\n")).toBe(0);
  expect(wordcount(words)).toBe(12);
});
