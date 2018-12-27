import u from "./index";

test("uuid", () => {
  const dict = {};
  let i = 10000;
  let x = i;
  while (i--) {
    dict[u.uuid()] = true;
  }
  const keys = Object.keys(dict);
  expect(keys.length).toBe(x);
  expect(keys.some(id => id.length !== 16)).toBe(false);
});
