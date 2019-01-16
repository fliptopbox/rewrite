import terminate from "./terminate";

test("word temination", () => {
  expect(terminate("word")).toBe("word");
  expect(terminate("word", null)).toBe("word");

  // positive tests
  expect(terminate("word", true)).toBe("word.");
});
