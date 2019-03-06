import jsdom from "jsdom";
import collectionToHtml from "./collectionToHtml";

const { JSDOM } = jsdom;
let dom, p, collection;

test("simple single value", () => {
  expect(collectionToHtml).not.toBeUndefined();
  expect(collectionToHtml()).toBeUndefined();

  collection = [{ text: "kilroy" }];
  expect(collectionToHtml(collection)).toEqual("<p>kilroy</p>\n<p><br/></p>");
});

test("collecion with versions data", () => {
  collection = [{ text: "kilroy", versions: [">is here", "was here"] }];

  dom = new JSDOM(collectionToHtml(collection));
  p = dom.window.document.querySelector("p");

  let { innerHTML, id, dataset, className } = p;

  expect(innerHTML).toEqual("kilroy");
  expect(className).toBe("locked");
  expect(dataset).toBeDefined();
  expect(dataset.versions).toBeDefined();
  expect(id).toBeDefined();
});

test("collecion without text data should use version candidate", () => {
  collection = [{ versions: [">is here", "was here", "", "today"] }];

  dom = new JSDOM(collectionToHtml(collection));
  p = dom.window.document.querySelector("p");

  let { innerHTML, id, dataset, className } = p;

  expect(innerHTML).toEqual("was here today");
  expect(className).toBe("locked");
  expect(dataset).toBeDefined();
  expect(dataset.versions).toBeDefined();
  expect(id).toBeDefined();
});

test("should have a selected className", () => {
  collection = [
    { text: "kilroy", versions: [">is here", "was here"], selected: true }
  ];

  dom = new JSDOM(collectionToHtml(collection));
  p = dom.window.document.querySelector("p");

  let { innerHTML, id, dataset, classList } = p;

  expect(innerHTML).toEqual("kilroy");
  expect(classList.contains("locked")).toBe(true);
  expect(classList.contains("selected")).toBe(true);
  expect(dataset).toBeDefined();
  expect(dataset.versions).toBeDefined();
  expect(id).toBeDefined();
});
test("should have a emtpy className", () => {
  collection = [
    { text: "", versions: [">is here", "> was here"], selected: true }
  ];

  dom = new JSDOM(collectionToHtml(collection));
  p = dom.window.document.querySelector("p");

  let { innerHTML, id, dataset, classList } = p;

  expect(innerHTML).toEqual("<br>");
  expect(classList.contains("locked")).toBe(true);
  expect(classList.contains("selected")).toBe(true);
  expect(classList.contains("empty")).toBe(true);
  expect(dataset).toBeDefined();
  expect(dataset.versions).toBeDefined();
  expect(id).toBeDefined();
});

test("all additional object keys (aka non-essentials) are classNames", () => {
  collection = [
    {
      text: "",
      versions: [">is here", "> was here"],
      selected: true,
      inactive: true,
      "custom-value": true
    }
  ];

  dom = new JSDOM(collectionToHtml(collection));
  p = dom.window.document.querySelector("p");

  let { innerHTML, id, dataset, classList } = p;

  expect(innerHTML).toEqual("<br>");
  expect(classList.contains("locked")).toBe(true);
  expect(classList.contains("custom-value")).toBe(true);
  expect(classList.contains("inactive")).toBe(true);
  expect(classList.contains("selected")).toBe(true);
  expect(classList.contains("empty")).toBe(true);
  expect(dataset).toBeDefined();
  expect(dataset.versions).toBeDefined();
  expect(id).toBeDefined();
});
