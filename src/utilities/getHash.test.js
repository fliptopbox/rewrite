import u from "./";

test("getHash", () => {
  expect(u.getHash()).toBe(null);
  expect(u.getHash("xxxx#123")).toBe("123");
  expect(u.getHash("xxxx#yyyy#123")).toBe("yyyy#123");
  expect(u.getHash("xxxx#")).toBe(null);
  expect(u.getHash("#xxxx")).toBe("xxxx");
  expect(u.getHash("xxxx")).toBe(null);
});
