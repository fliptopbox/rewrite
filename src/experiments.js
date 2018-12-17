import rawMarkdownText from "./test";
import md from "marked";

const r = new md.Renderer();
r.paragraph = text => {
  console.log(1, text.split("\n").length);
  return text;
};

console.log(md(rawMarkdownText, { renderer: r }));

document.execCommand("defaultParagraphSeparator", false, "p");
const doc = document.querySelector(".text");

const ns = "rewrite";
const saved = `{"hist":["ArrowRight","ArrowRight","Backspace","ArrowRight"],"article":["","<p>I did the right thing. I gave her a very gentle little slap. And in my defence, it worked, I mean she stopped screaming. So … you know, it was the right thing to do.</p><p><br></p><p>But, on the other hand, I ended up wasting fifty three pounds, correction fifty four pounds. And that’s already halfway to a good old-fashioned hooker, you know what I’m saying? Oh well … win some, lose some. God, I hate this place, I can’t wait to get back to London. Like my dad used to say ... “You get what you pay for”.</p><p><br></p><p>It is really difficult to sleep with a light on, but with a hard on it’s impossible. And it stayed on. I tried to make it go away, but that didn’t work. When I close my eyes to conjure fantasies of filth and flesh all I see is that shadow. It’s intruding on my darkness.</p>","<p>I did the right thing. I gave her a very gentle little slap. And in my defence, it worked, I mean she stopped screaming. So … you know, it was the right thing to do.</p><p><br></p><p>But, on the other hand, I ended up wasting fifty three pounds, correction fifty four pounds. And that’s already halfway to a good old-fashioned hooker, you know what I’m saying? Oh well … win some, lose some. God, I hate this place, I can’t wait to get back to London. Like my dad used to say ... “You get what you pay for”.</p><p>It is really difficult to sleep with a light on, but with a hard on it’s impossible. And it stayed on. I tried to make it go away, but that didn’t work. When I close my eyes to conjure fantasies of filth and flesh all I see is that shadow. It’s intruding on my darkness.</p>","<p>I did the right thing. I gave her a very gentle little slap. And in my defence, it worked, I mean she stopped screaming. So … you know, it was the right thing to do.</p><p>But, on the other hand, I ended up wasting fifty three pounds, correction fifty four pounds. And that’s already halfway to a good old-fashioned hooker, you know what I’m saying? Oh well … win some, lose some. God, I hate this place, I can’t wait to get back to London. Like my dad used to say ... “You get what you pay for”.</p><p>It is really difficult to sleep with a light on, but with a hard on it’s impossible. And it stayed on. I tried to make it go away, but that didn’t work. When I close my eyes to conjure fantasies of filth and flesh all I see is that shadow. It’s intruding on my darkness.</p>"]}`;
const defaultState = { hist: [], article: [] };
const data = saved ? JSON.parse(saved) : defaultState;

// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key

doc.innerHTML = lastArticle();
/*
  $('.editable').on('keyup', function(){
    var selection = window.getSelection();
    var node = selection.focusNode.parentNode;
    var keyShortcut = /^[^\S\r\n]{3}/gm;
    var input = $(node).text();
    
    if (input.match(keyShortcut) && $(node).is('p')){
      $(node).replaceWith('<code></code>')
    };
  });
*/
function lastArticle() {
  return data.article.slice(-1)[0];
}

function updateHistory(key) {
  data.hist.push(key);
  data.hist = data.hist.slice(-4);

  // update doc IF there is a text chane
  const html = doc.innerHTML;
  if (html === data.article.slice(-1)[0]) {
    return;
  }

  // update history and save locally
  data.article.push(doc.innerHTML);
  data.article = data.article.slice(-4);

  // setTimeout(() => {
  localStorage.setItem(ns, JSON.stringify(data));
  // }, 0);
}

function keyCatch(e) {
  const re = new RegExp("(tab)", "i");

  // interupt these keys
  if (re.test(e.key)) {
    e.preventDefault();
  }

  // update history
  updateHistory(e.key);

  // monitor triggers
  // ie SHIFT SHIFT e
  return true;
}

function getParentNode() {
  return window.getSelection().focusNode.parentNode;
}

doc.onkeydown = e => {
  const code = e.key;
  const value = keyCatch(e);

  // this is the current line node
  const selection = window.getSelection();
  const node = getParentNode();

  console.log(
    // hist.slice(-2).join(",") ===  "9,9",
    data.hist.slice(-2),
    data.article.slice(-2),
    code,
    node
  );

  return value;
};
