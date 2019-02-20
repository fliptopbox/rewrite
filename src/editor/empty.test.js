import empty from "./empty";

test("empty utility funtion", () => {
  expect(empty).not.toBeUndefined();
  expect(empty()).toBeUndefined();
  expect(empty("")).toBe("");
  expect(empty(0)).toBe(0);
  expect(empty(null)).toBe(null);
});
