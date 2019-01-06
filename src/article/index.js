import u from "../utilities";
import collectionToHtml from "../editor/collectionToHtml";
import importJSON from "./importJSON";
// import textToArray from "../editor/textToArray";
import htmlToCollection from "./htmlToCollection";

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

function deselect(reset = false) {
  selected && selected.classList.remove("selected");
  reset && (selected = null);
}

function handleClick(e) {
  // only load locked nodes
  let { id, dataset } = e.target;
  if (!id || !dataset.versions) return;

  // de-select any existing nodes
  if (selected) {
    deselect();

    if (selected.id === id) {
      selected = null;
      callbacks.click();
      return;
    }
  }

  selected = document.querySelector(`#${id}`);
  selected.classList.add("selected");
  selected.dataset.wordcount = u.wordcount(e.target.innerText);

  const { versions } = dataset;
  const json = versions && JSON.parse(versions);

  callbacks.click(json, selected);
}

function handleDoubleClick(e) {
  e.target.id = e.target.id || u.uuid();
  const bypassMsg = e.shiftKey;
  let { id, innerText, dataset, nodeName } = e.target;

  if (!/div/i.test(nodeName)) {
    console.warn("WARNING! Element not div. Bypass", nodeName);
    return;
  }

  deselect(true);
  const { versions } = dataset;
  const text = u.inflate(innerText);
  const value = (versions && JSON.parse(versions)) || text || "";

  if (versions) {
    // confirm delete
    const confirmed =
      bypassMsg || window.confirm(u.message("confirmDelete")) || false;
    if (!confirmed) return;

    // next cleanup this
    e.target.className = "";
    e.target.id = "";
    e.target.dataset.versions = "";

    // update local storage
    callbacks.dblclick();
    return;
  }

  selected = document.querySelector(`#${id}`);
  selected.className = "locked selected";
  callbacks.dblclick(value, selected);
}

function list(astext = false) {
  const data = read();
  const { articles } = data;
  const keys = Object.keys(articles);
  const list = keys.map((s, n) => `${n}: ${s}  ${articles[s].name}`).join("\n");
  console.log(list);
  return astext ? list : keys;
}

function save() {
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    const collection = htmlToCollection(article.children);
    if (!collection || !collection.length) {
      console.error("No DATA array", article.children);
      return;
    }
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

function deleteArticle(index = null) {
  const data = read();
  const keys = list();

  index = index || u.prompt("DELETE ARTICLE:\nChoose one:");
  const { articles, current } = data;
  const key = keys[Number(index)];

  if (articles[key]) {
    delete articles[key];
    console.log("DELETED [%s]", key);
    write({ ...data });
  }

  if (key === current) {
    id = data.articles[0].id;
    console.warn("DELETED CURRENT article [%s] loading first file", id);
    load(id);
  }
}

function open() {
  const keys = list();
  const index = u.prompt("choose one:");
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

  article.innerHTML = collectionToHtml(current.data);
  setTimeout(scrollToView, 650);
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

function getMetaData(key, value) {
  let local = read();
  const { current, articles } = { ...local };
  let currentValue = articles[current][key] || null;

  if (key && value) {
    articles[current][key] = value;
    write(Object.assign({}, { current, articles }));
    return;
  }

  return currentValue;
}

function readTextFile(e) {
  const files = e.currentTarget.files;
  const reader = new FileReader();
  const file = files[0];
  const filename = file.name;

  reader.onload = e => {
    const { result } = e.target;
    const { key, name, data } = importJSON(result, filename);
    load(key, name, data);
  };
  reader.readAsText(file);
}

function scrollToView() {
  const el = document.querySelector(".selected");
  if (!el) return;
  el.scrollIntoViewIfNeeded();
}

function initialize(selector = "#document") {
  article = document.querySelector(selector);
  article.ondblclick = handleDoubleClick;
  article.onclick = handleClick;
  article.onkeydown = handleKeyDown;

  document.getElementById("uploadInput").onchange = readTextFile;

  const methods = {
    callback,
    import: importJSON,
    export: exportJSON,
    meta: getMetaData,
    read: readTextFile,
    center: scrollToView,
    update,
    load,
    open,
    save,
    delete: deleteArticle,
    list
  };

  window.RE = window.RE || {
    article: methods
  };
  return methods;
}

export default initialize;
