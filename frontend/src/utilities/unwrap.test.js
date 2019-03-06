import unwrap from "./unwrap";

test("unwrap hard break text columns", () => {
  const text = `
    Alpha beta charlie delta echo
    foxtro. Golf hotel indigo juliet.

    Kilo lima mama niner oscar papa
    quebec romeo sierra tango uniform
    violet whiskey exray zebra.    `;

  expect(unwrap(text)).toHaveLength(3);
});
test("use regExp to unwrap with exceptions", () => {
  const text = `
            CHARACTER (V.O)
        (parenthesis)
    Alpha beta charlie delta echo
    foxtro. Golf hotel indigo juliet
        (more wrylys)
    Kilo lima mama niner oscar papa
    quebec romeo sierra tango uniform
    violet whiskey exray zebra.
`;
  const re = [
    /^[^a-z]+$/, // chatacter
    /^\(.*\)$/ // parentheticals
  ];
  const array = unwrap(text, re);
  expect(array).toHaveLength(5);
  expect(array[0]).toBe("CHARACTER (V.O)");
  expect(array[1]).toBe("(parenthesis)");
  expect(array[3]).toBe("(more wrylys)");
});
