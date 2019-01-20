import u from "./utilities/";
import Article from "./modules/Article";
import Sentences from "./modules/Sentences";
import Controller from "./modules/Controller";
import Storage from "./modules/Storage/";

// import PubSub from "pubsub-js";

import "./styles.scss";

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
  typewriter: toggleTypewriterMode,
  collapse: ctrl.collapse,
  strikeThrough: ctrl.strikeThrough,
  export: article.export,
  storage: store
};

function toggleTypewriterMode(b) {
  const body = document.querySelector("body");
  let forward = article.typewriter(b);
  forward = b === undefined ? !forward : forward;
  article.typewriter(forward);
  body.classList[forward ? "add" : "remove"]("typewriter");
}

function saveToDisk() {
  const children = article.texteditor.children;
  const data = u.htmlToCollection(children);
  store.write(data);

  // update wordcount
  updateWordCount(article.texteditor);
}

function updateWordCount(el) {
  return u.defer(
    "wordcount",
    () => {
      const text = el.innerText;
      console.log("WORDCOUNT", u.wordcount(text));
    },
    500
  );
}

const startup = (function() {
  setTimeout(() => {
    document.querySelector(".container").classList.remove("hidden");
    document.querySelector(".overlay").classList.add("hidden");
  }, 950);
  return Function;
})();

startup();
