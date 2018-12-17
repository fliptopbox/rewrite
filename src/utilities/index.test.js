import u from "./";

test("deep equal", () => {
  let a, b;

  a = "string";
  b = "string";
  expect(u.deepEqual(a, b)).toBe(true);

  a = 123;
  b = 100 + 20 + 3;
  expect(u.deepEqual(a, b)).toBe(true);

  a = new Date("1 Jan 1970");
  b = new Date(0);
  expect(u.deepEqual(a, b)).toBe(true);

  a = { c: 3333, b: 2222, a: 1111 };
  b = { a: 1111, c: 3333, b: 2222 };
  expect(u.deepEqual(a.a, b.a)).toBe(true);
  expect(u.deepEqual(a.b, b.b)).toBe(true);
  expect(u.deepEqual(a.c, b.c)).toBe(true);
  expect(u.deepEqual(a, b)).toBe(true);
});
