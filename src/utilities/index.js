import childrenToVersionArray from "./childrenToVersionArray";
import collectionToHtml from "./collectionToHtml";
import deepEqual from "deep-is";
import defer from "./defer";
import download from "./download";
import focusOn from "./focusOn";
import htmlToCollection from "./htmlToCollection";
import inflate from "./inflate";
import message from "./message";
import readTextFile from "./readTextFile";
import selectedValueArray from "./selectedValueArray";
import toggleStringCase from "./toggleStringCase";
import tts from "./tts";
import unwrap from "../utilities/unwrap";
import uuid from "./uuid";
import wordcount from "./wordcount";

export default {
  alert,
  confirm,
  prompt,

  childrenToVersionArray,
  collectionToHtml,
  deepEqual,
  defer,
  download,
  focusOn,
  htmlToCollection,
  inflate,
  message,
  readTextFile,
  selectedValueArray,
  storage,
  time,
  toggleStringCase,
  tts,
  unwrap,
  uuid,
  wordcount
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
