import arrayToHtml from "./arrayToHtml";

test("a simple array converts to an HTML string", () => {
  const array = ["Alpha beta charlie.", "Delta echo foxtrot."];
  const html = "<p>Alpha beta charlie.</p>\n<p>Delta echo foxtrot.</p>";

  expect(arrayToHtml(array)).toBe(html);
});

test("the commented lines are excluded from the output", () => {
  const array = [
    "Alpha beta charlie.",
    "> Hotel indigo julia kilo.",
    "Delta echo foxtrot."
  ];
  const html = [
    `<p>Alpha beta charlie.</p>`,
    `<p class="inactive">Hotel indigo julia kilo.</p>`,
    `<p>Delta echo foxtrot.</p>`
  ].join("\n");

  expect(arrayToHtml(array)).toBe(html);
});

test("rows with falsey values are converted to BR tags", () => {
  const array = [
    "Alpha beta charlie.",
    "",
    null,
    false,
    0,
    "Delta echo foxtrot."
  ];
  const html = [
    `<p>Alpha beta charlie.</p>`,
    `<p><br/></p>`,
    `<p><br/></p>`,
    `<p><br/></p>`,
    `<p><br/></p>`,
    `<p>Delta echo foxtrot.</p>`
  ].join("\n");

  expect(arrayToHtml(array)).toBe(html);
});

test("it will recognize four comment type chatacters", () => {
  const array = [">alpha", "/beta", "?charlie", "!delta"];
  const html = [
    `<p class="inactive">alpha</p>`,
    `<p class="inactive">beta</p>`,
    `<p class="inactive">charlie</p>`,
    `<p class="inactive">delta</p>`
  ].join("\n");

  expect(arrayToHtml(array)).toBe(html);
});

test("the comment character and surronding whitespace is trimmed ", () => {
  expect(arrayToHtml([">alpha"])).toBe('<p class="inactive">alpha</p>');
  expect(arrayToHtml(["> alpha"])).toBe('<p class="inactive">alpha</p>');
  expect(arrayToHtml(["    > alpha"])).toBe('<p class="inactive">alpha</p>');
  expect(arrayToHtml(["     >alpha"])).toBe('<p class="inactive">alpha</p>');
  expect(arrayToHtml([">>>   alpha"])).toBe('<p class="inactive">alpha</p>');
  expect(arrayToHtml([">alpha     "])).toBe('<p class="inactive">alpha</p>');
});
