import jsdom from "jsdom";
import collectionToHtml from "./collectionToHtml";

const { JSDOM } = jsdom;
let dom, div, collection;

test("simple single value", () => {
  expect(collectionToHtml).not.toBeUndefined();
  expect(collectionToHtml()).toBeUndefined();

  collection = [{ text: "kilroy" }];
  expect(collectionToHtml(collection)).toEqual(
    "<div>kilroy</div>\n<div><br/></div>"
  );
});

test("collecion with versions data", () => {
  collection = [{ text: "kilroy", versions: [">is here", "was here"] }];

  dom = new JSDOM(collectionToHtml(collection));
  div = dom.window.document.querySelector("div");

  let { innerHTML, id, dataset, className } = div;

  expect(innerHTML).toEqual("kilroy");
  expect(className).toBe("locked");
  expect(dataset).toBeDefined();
  expect(dataset.versions).toBeDefined();
  expect(id).toBeDefined();
});

test("collecion without text data should use version candidate", () => {
  collection = [{ versions: [">is here", "was here", "", "today"] }];

  dom = new JSDOM(collectionToHtml(collection));
  div = dom.window.document.querySelector("div");

  let { innerHTML, id, dataset, className } = div;

  expect(innerHTML).toEqual("was here today");
  expect(className).toBe("locked");
  expect(dataset).toBeDefined();
  expect(dataset.versions).toBeDefined();
  expect(id).toBeDefined();
});
