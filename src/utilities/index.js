import deepEqual from "deep-is";
import uuid from "./uuid";
import inflate from "./inflate";
import message from "./message";
import wordcount from "./wordcount";
import tts from "./tts";

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

const { prompt, confirm } = window;

export default {
  uuid,
  deepEqual,
  inflate,
  storage,
  message,
  wordcount,
  prompt,
  confirm,
  time,
  tts
};
