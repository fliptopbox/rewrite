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

let timer;
let count = 0;
let delay = 250;

function time() {
  return new Date().toString().replace(/.* (\d+:\d+:\d+) .*/g, "$1");
}
function storage(sufix = null) {
  const ns = ["rewrite", sufix].filter(val => val).join("-");

  return {
    read: () => {
      const data = localStorage[ns] || null;
      return data && JSON.parse(data);
    },

    write: obj => {
      clearTimeout(timer);
      count = (count || 0) + 1;
      timer = setTimeout(() => {
        console.log("localstroage SAVE", count, time(), obj);
        localStorage[ns] = JSON.stringify(obj);
        count = 0;
      }, delay);
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

export default {
  childrenToVersionArray,
  collectionToHtml,
  htmlToCollection,
  toggleStringCase,
  selectedValueArray,
  uuid,
  deepEqual,
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
