import u from "./utilities/";
import Article from "./modules/Article";
import Sentences from "./modules/Sentences";
import Controller from "./modules/Controller";

// import PubSub from "pubsub-js";

import "./styles.scss";

const articleText = `
"Corner to corner, that's it ... now, tip to tip. Great. Um, give me a minute, I need to remember how it goes ..."

I turn the folded paper over. Pinch the corners into a diamond, halve the edges, pull the long sides into the centre and stop.

I unfold it, and start again.

The paper is creased with failed attempts to make an origami crane. I have done this one thousand times.

My world has rewinds five years. And now I’m with Shelly, we are making a paper crane. I look down, to make sure she is keeping up, she smiles at me, her fingers follow my lead. A varnished fingernail irons the fold into a sharp edge. She nods, ready to continue.        

But the next step is missing. That next fold, I just can't see it anymore. It’s forgotten. Everything else is vivid. Shelly’s chuckle, her bald shaven head, her turquoise surgical gown, her gaunt face ... where has it gone?

When Shelley died the next fold got lost.

"James?"
`;

const body = document.getElementsByTagName("body")[0];
const article = new Article("c1", { prefix: "a" });
const sentences = new Sentences("c2", { prefix: "s", hidden: true });
const ctrl = new Controller();

article.on("after", null, saveToDisk);
sentences.on("after", null, saveToDisk);

article.bindTo(sentences);
sentences.bindTo(article);

window.RE = {
  typewriter: toggleTypewriterMode,
  collapse: ctrl.collapse,
  strikeThrough: ctrl.strikeThrough,
  export: article.export
};

function toggleTypewriterMode(b) {
  let forward = article.typewriter(b);
  forward = b === undefined ? !forward : forward;
  article.typewriter(forward);
  body.classList[forward ? "add" : "remove"]("typewriter");
}

function saveToDisk() {
  const children = article.texteditor.children;
  const data = u.childrenToVersionArray(children);
  u.storage("article").write(data);
}

const startup = (function() {
  setTimeout(() => {
    document.querySelector(".container").classList.remove("hidden");
    document.querySelector(".overlay").classList.add("hidden");
  }, 750);
  return Function;
})();

startup();
