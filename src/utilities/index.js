import deepEqual from "deep-is";
import uuid from "./uuid";
import inflate from "./inflate";
import message from "./message";
import wordcount from "./wordcount";
import focusOn from "./focusOn";
import tts from "./tts";
import childrenToVersionArray from "./childrenToVersionArray";
import toggleStringCase from "./toggleStringCase";
import selectedValueArray from "./selectedValueArray";
import collectionToHtml from "./collectionToHtml";
import htmlToCollection from "./htmlToCollection";
import defer from "./defer";

export default {
  childrenToVersionArray,
  collectionToHtml,
  htmlToCollection,
  toggleStringCase,
  selectedValueArray,
  uuid,
  deepEqual,
  defer,
  inflate,
  storage,
  message,
  wordcount,
  focusOn,
  prompt,
  confirm,
  alert,
  time,
  tts
};

function time() {
  return new Date().toString().replace(/.* (\d+:\d+:\d+) .*/g, "$1");
}

function storage(sufix = null) {
  let delay = 250;
  const ns = ["rewrite", sufix].filter(val => val).join("-");

  // this looks strange. leave it! it's for JEST testing.
  const localStorage = this.localStorage || window.localStorage;

  return {
    data: () => {
      return localStorage;
    },

    delete: () => {
      delete localStorage[ns];
    },

    read: () => {
      const data = localStorage[ns] || null;
      const isJson = data && /^[\[\{\"]/.test(data);
      return isJson ? JSON.parse(data) : data;
    },

    write: (obj, async = false) => {
      const fn = () => (localStorage[ns] = JSON.stringify(obj));
      return async ? defer(ns, fn, delay, true) : fn();
    }
  };
}

// const { prompt, confirm, alert } = windowdd
function prompt(s, value) {
  return window.prompt(s, value);
}

function confirm(s) {
  return window.confirm(s);
}

function alert(s) {
  return window.alert(s);
}
