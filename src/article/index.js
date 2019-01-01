import u from "../utilities";
import collectionToHtml from "../editor/collectionToHtml";
import textToArray from "../editor/textToArray";

let article;
let selected;
let timer;
let delay = 1000;

const sample = require("./startup.json");
const { read, write } = u.storage("article");

const callbacks = {
  click: () => {},
  dblclick: () => {}
};

function callback(key, fn) {
  callbacks[key.toLowerCase()] = fn;
}

function handleKeyDown(e) {
  //! prevent locked rows from editing text
  save();
}

function handleClick(e) {
  // de-select any existing nodes
  if (selected) {
    selected.classList.remove("selected");
  }

  // only load locked nodes
  let { id, dataset } = e.target;
  if (!id || !dataset.versions) return;

  selected = document.querySelector(`#${id}`);
  selected.classList.add("selected");
  selected.dataset.wordcount = u.wordcount(e.target.innerText);

  const { versions } = dataset;
  const json = versions && JSON.parse(versions);

  callbacks.click(json, selected);
}

function handleDoubleClick(e) {
  e.target.id = e.target.id || u.uuid();
  let { id, innerText, dataset } = e.target;
  const { versions } = dataset;
  const text = u.inflate(innerText);
  const value = (versions && JSON.parse(versions)) || text || "";

  if (versions) {
    // confirm delete
    if (!window.confirm(u.message("confirmDelete"))) return;

    // next ... remove DOM reference
    selected.id = "";
    selected = null;

    // next cleanup this
    e.target.className = "";
    e.target.id = "";
    e.target.dataset.versions = "";

    // update local storage
    console.log("toggle off", selected);
    callbacks.dblclick(value, null);
    return;
  }

  selected = document.querySelector(`#${id}`);
  selected.className = "locked selected";
  callbacks.dblclick(value, selected);
}

function list() {
  const data = read();
  const { articles } = data;
  const keys = Object.keys(articles);
  const list = keys.map((s, n) => n + ": " + s).join("\n");
  console.log(list);
  return keys;
}

function htmlToCollection(children) {
  return [...children].map(el => {
    const { innerText = "", dataset } = el;
    const versions = dataset.versions && JSON.parse(dataset.versions);

    return {
      text: innerText.trim(),
      versions: versions
    };
  });
}

function save() {
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    const collection = htmlToCollection(article.children);
    const data = read();
    const now = new Date().valueOf();
    const { current } = data;
    Object.assign(data.articles[current], { data: collection, opened: now });
    write(data);
  }, delay);
}

function create(key, data, name) {
  const id = key || u.uuid();
  const created = new Date().valueOf();
  return { id, name, data, created };
}

function open() {
  const keys = list();
  const index = window.prompt("choose one:");
  load(keys[Number(index)]);
}

function load(key, name, collection) {
  let id;
  let data = read();
  let current = null;
  const ts = new Date().valueOf();

  if (!data) {
    const newobject = create(null, sample, "Untitled");
    id = newobject.id;
    data = { articles: {} };
    data.articles[id] = { ...newobject };
  }

  // try to get the @key article
  if (key && data.articles[key]) id = key;

  // create a blank/new document
  if (!id && (key || name || collection)) {
    id = key || u.uuid();
    name = name || "New document";
    collection = collection || [{ text: name }];
    data.articles[id] = create(id, collection, name);
    console.log("NEW", data.articles);
  }

  // try to use last document edited
  if (!id && data.current && data.articles[data.current]) id = data.current;

  // last resort open first article
  if (!id) id = Object.keys(data.articles)[0];

  current = data.articles[id];
  current.opened = ts;
  data.current = id;

  //   const objectArray;
  //   const innerHTML = collectionToHtml(local);
  article.innerHTML = collectionToHtml(current.data);
  write({ ...data });
}

function update(candidate, versions) {
  // updates the currently selected node
  if (!selected) {
    console.error("cant update selected node");
    return;
  }

  selected.innerText = candidate;
  selected.dataset.wordcount = u.wordcount(candidate);
  selected.dataset.versions = JSON.stringify(versions);

  save();
}

function importJSON(payload) {
  let object;
  let collection;
  let text = payload || window.prompt("Please paste JSON export");

  try {
    object = JSON.parse(text);
  } catch (e) {
    console.error("JSON import error", e);
  }

  // payload is plainText
  if (!object) {
    collection = textToArray(text);
    console.log("!!!!!", text, collection);
    collection.map(row => {
      text: row.trim();
    });

    object = {
      id: u.uuid(),
      name: "Untitled Import",
      data: [...collection]
    };
  }

  //! need to check the UUID does not exist OR
  //! warn that it will replace the existring data

  const { key, name, data } = object;

  load(key, name, data);
}

function exportJSON() {
  const local = read();
  const { current } = local;
  const { id, name } = local.articles[current];
  const filename = `${name}-${id}`;
  const text = JSON.stringify(local.articles[current]);

  const element = document.createElement("a");
  const payload = encodeURIComponent(text);

  element.setAttribute("href", "data:text/json;charset=utf-8," + payload);
  element.setAttribute("download", `${filename}.json`);
  element.style.display = "none";

  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function initialize(selector = "#document") {
  article = document.querySelector(selector);
  article.ondblclick = handleDoubleClick;
  article.onclick = handleClick;
  article.onkeydown = handleKeyDown;

  const methods = {
    callback,
    import: importJSON,
    export: exportJSON,
    update,
    load,
    open,
    save,
    list
  };

  window.RE = {};
  window.RE.article = methods;
  return methods;
}

export default initialize;
