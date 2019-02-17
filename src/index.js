import u from "./utilities/";
import Article from "./modules/Article";
import Sentences from "./modules/Sentences";
import Controller from "./modules/Controller";
import Storage from "./modules/Storage/";
import Parse from "./utilities/Parse";
import dividerinit from "./modules/divider";

// import PubSub from "pubsub-js";

import buttons from "./modules/uibuttons";
import "./styles.scss";

let divider;
const store = new Storage(u.storage.bind(window));
const article = new Article("c1", { prefix: "a" });
const sentences = new Sentences("c2", { prefix: "s", hidden: true });
const ctrl = new Controller();

article.on("after", null, saveToDisk);
sentences.on("after", null, saveToDisk);

article.bindTo(sentences);
sentences.bindTo(article);

const articleText = store.initilize();
article.init(articleText.data);

window.RE = {
  storage: store,
  article: article
};

const startup = (function() {
  setTimeout(() => {
    document.querySelector(".container").classList.remove("hidden");
    document.querySelector(".overlay").classList.add("hidden");
    divider = dividerinit();
    divider.add("wordcount");
  }, 950);
  return Function;
})();

startup();

/*
 * some UI buttons need links to objects defined
 * outside the loader script, for example:
 * the Article instance or the store Object
 *
 * These late bindings are handled here ...
 * the default UI buttons (array) is updated
 * to assign the callbacks with instance references
 *
 */
const callbackHash = {
  typewriter: toggleTypewriterMode,
  readSelected: readSelected,
  uploadInput: importAndOpen
};

buttons.map(obj => (obj.fn = callbackHash[obj.id] || obj.fn));

ctrl.initialize(buttons, store, article);
ctrl.getFileList();

function toggleTypewriterMode() {
  const { typewriter = false } = this.state.modifiers;
  this.state.modifiers.typewriter = !typewriter;

  const bool = this.toggleClassName("typewriter");

  let forward = article.typewriter(bool);
  forward = bool === undefined ? !forward : forward;
  article.typewriter(forward);
}

function importAndOpen(e) {
  store.open(e, function(name, text) {
    const p = new Parse(text);
    const current = store.create(null, name, p.toCollection());
    article.init(current.data);
  });
}

function readSelected() {
  // looks for selected paragraph and reads it
  const current = article.selected;
  if (!current) return;
  const array = u.inflate(current.innerText, true);
  window.TTS.read(array);
}

function saveToDisk() {
  const children = article.texteditor.children;
  const data = new Parse(children).toCollection();
  store.write(data);

  // update wordcount
  updateWordCount(article.texteditor);
}

function updateWordCount(el) {
  return u.defer(
    "wordcount",
    () => {
      const text = el.innerText;
      const wordcount = u.wordcount(text);
      divider.update("wordcount", wordcount);
      console.log("WORDCOUNT", wordcount);
    },
    500
  );
}
