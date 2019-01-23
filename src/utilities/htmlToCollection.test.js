import jsdom from "jsdom";
const { JSDOM } = jsdom;

import htmlToCollection from "./htmlToCollection";

const article = `
<article id="document" class="content" contenteditable="true">
<div># Tunnel vision</div>
<div class="authors">by Bruce Thomas</div>
<div><br></div>
<div><br></div>
<div>Draft 1 - UK English</div>
<div
    id="b401548985013040"
    class="selected locked" 
    data-versions='[
        "A new generation", 
        "a new narcotic and", 
        "a new paradigm for self discovery."
    ]'>"A new generation, a new narcotic and a new paradigm for self discovery."</div>
<div><br></div>
<div
    id="u401548985013040"
    class="locked inactive"
    data-versions='[
        "A new generation, a new narcotic and a new paradigm for self discovery."
    ]'>"A new generation, a new narcotic and a new paradigm for self discovery."</div>
<div><br></div>
<div>------------</div>
</article>
`;

const dom = new JSDOM(article);
const { document } = dom.window;
const { children } = document.querySelector("article");
const array = htmlToCollection(children);

test("the collection has a predictable length", () => {
  expect(array).toHaveLength(10);
});

test("the collection row has predictable text", () => {
  expect(array[0]).toHaveProperty("text", "# Tunnel vision");
});

test("custom classNames occur as object props", () => {
  expect(array[1]).toHaveProperty("text");
  expect(array[1]).not.toHaveProperty("versions");
  expect(array[1]).toHaveProperty("authors");
});

test("get an Object literal from DOM children", () => {
  expect(array[7]).toHaveProperty("text");
  expect(array[7]).toHaveProperty("versions");
  expect(array[7].versions).toHaveLength(1);
  expect(array[7]).not.toHaveProperty("selected");
});

test("get an Object with selected state", () => {
  expect(array[5]).toHaveProperty("text");
  expect(array[5]).toHaveProperty("versions");
  expect(array[5].versions).toHaveLength(3);
  expect(array[5]).toHaveProperty("selected");
});

test("get an Object with no meta data", () => {
  expect(array[6]).toHaveProperty("text", "");
  expect(array[6]).not.toHaveProperty("versions");
  expect(array[6]).not.toHaveProperty("selected");
});

test("get an Object literal from DOM children", () => {
  expect(array[7]).toHaveProperty("text");
  expect(array[7]).toHaveProperty("versions");
  expect(array[7]).toHaveProperty("inactive");
  expect(array[7].versions).toHaveLength(1);
  expect(array[7]).not.toHaveProperty("selected");
});
