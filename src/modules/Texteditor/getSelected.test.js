//

import jsdom from "jsdom";
import getSelected from "./getSelected";

const { JSDOM } = jsdom;
const dom = new JSDOM(`
    <p 
        id="a1"
        class="alpha beta"
        data-versions='["charlie", "> delta", "echo"]'>
            charlie echo
    </p>
`);

// const el = {
//   innerText: undefined,
//   dataset: { versions: undefined }
// };

// console.log(123, el.dataset.versions, el.innerHTML);

test("if initialized with nothing, undefined is returned", () => {
  const selected = new getSelected();
  expect(selected).toBeDefined();
  expect(selected.el).toBeUndefined();
  expect(selected.dataset).toBeUndefined();
  expect(selected.classList).toBeUndefined();

  expect(selected.options).toBeDefined();
  expect(selected.candidate).toBeDefined();
  expect(selected.versions).toBeDefined();

  expect(selected.options.re).toBeDefined();
  expect(selected.versions()).toBeUndefined();
  expect(selected.candidate()).toBeUndefined();
});

test("initialized with a DOM element should correlate values", () => {
  const el = dom.window.document.querySelector("p");

  const selected = new getSelected(el);
  expect(selected).toBeDefined();
  expect(selected.el.id).toBe("a1");
  expect(selected.el.classList).toHaveLength(2);
  expect(selected.el.classList.contains("alpha")).toBeTruthy();
  expect(selected.el.classList.contains("beta")).toBeTruthy();
  expect(selected.el.dataset).toBeDefined();
  expect(selected.el.dataset.versions).toBeTruthy();
  expect(selected.el.innerHTML.trim()).toBe("charlie echo");

  expect(selected.options).toBeDefined();
  expect(selected.versions()).toEqual(["charlie", "> delta", "echo"]);
  expect(selected.candidate()).toBe("charlie echo");
});

test.skip("the selected method basic integrity tests", () => {
  let text, candidate, versions;

  const selected = new getSelected();

  expect(selected()).toBeUndefined();
  expect(selected({})).toBeDefined();
  expect(selected(null)).toBeNull();

  expect(selected({ a: 1 })).not.toBeNull();

  text = "Kilroy was here .........";
  candidate = selected({ innerText: text }).candidate();
  expect(candidate).toBe(text);
  expect(typeof candidate).toBe("string");

  versions = selected({ innerText: text }).versions();
  expect(versions).not.toBe(text);
  expect(versions).toEqual([text]);
  expect(versions).toBeInstanceOf(Array);
});

test.skip("the versions Array trumps the candidate string", () => {
  let text, text2, candidate, versions;
  const selected = new getSelected();

  text = "Kilroy was here.";
  text2 = ["Elvis is the king!"];

  el.innerHTML = text;
  el.dataset.versions = JSON.stringify(text2);

  versions = selected(el).versions();
  expect(versions).not.toBe(text);
  expect(versions).toEqual(text2);
});

test.skip("the candidate should not render version comments", () => {
  let text, text2, candidate, versions;
  const selected = new getSelected();

  text = "Elvis is the king!\n\nThe end.";
  text2 = ["Elvis is the king!", "> Kilroy was here.", "The end."];

  el.dataset.versions = JSON.stringify(text2);

  candidate = selected(el).candidate();
  expect(candidate).toBe("Elvis is the king! The end.");

  versions = selected(el).versions();
  expect(versions).toEqual(text2);
});

test.skip("the candidate renders innerText if no version data is available", () => {
  let text, text2, candidate, versions;
  const selected = new getSelected();

  text = "Elvis is the king!\n\nThe end.";
  text2 = [text];

  el.innerText = text;
  el.dataset.versions = undefined;

  candidate = selected(el).candidate();
  expect(candidate).toBe(text);

  el.dataset.versions = null;
  versions = selected(el).versions();
  expect(versions).toEqual([text]);
});

test.skip("the method by default will recognise comment lines", () => {
  let text, candidate, versions;
  const selected = new getSelected();

  text = "Alpha. Charlie.";

  el.innerText = text;
  el.dataset.versions = `["Alpha.", ">  Bravo.", "Charlie."]`;

  candidate = selected(el).candidate();
  expect(candidate).toBe(text);

  el.dataset.versions = `["Alpha.", ">Bravo.", "Charlie."]`;
  candidate = selected(el).candidate();
  expect(candidate).toBe(text);

  el.dataset.versions = `["Alpha.", "?Bravo.", "Charlie."]`;
  candidate = selected(el).candidate();
  expect(candidate).toBe(text);

  el.dataset.versions = `["Alpha.", "! Bravo.", "Charlie."]`;

  candidate = selected(el).candidate();
  expect(candidate).toBe(text);

  el.dataset.versions = `["Alpha.", "/  Bravo.", "Charlie."]`;

  candidate = selected(el).candidate();
  expect(candidate).toBe(text);
});

test.skip("the method can recieve new RegExp options", () => {
  let opts, text, text2, candidate, versions;
  const selected = new getSelected();

  text = "Alpha. Charlie.";
  text2 = JSON.stringify(["Alpha.", "> Bravo.", "Charlie."]);

  el.innerText = text;
  el.dataset.versions = `["Alpha.", "@  Bravo.", "Charlie."]`;
  candidate = selected(el).candidate();
  expect(candidate).not.toBe(text);

  //   el.dataset.versions = `["Alpha.", "@  Bravo.", "Charlie."]`;
  //   opts = { re: { commentChars: /^@/ } };
  //   candidate = selected(el, { ...opts }).candidate();
  //   expect(candidate).toBe(text);
});
