import deepEqual from "deep-is";
import getHash from "./getHash";
import uuid from "./uuid";
import inflate from "./inflate";
import keysPressed from "./keysPressed";

let timer;
let count;
const delay = 1000;

function time() {
  return new Date().toString().replace(/.* (\d+:\d+:\d+) .*/g, "$1");
}

function storage(sufix) {
  const ns = ['rewrite', sufix].join("-")

  return {
    read: () => {
      const data = localStorage[ns] || null;
      return data && JSON.parse(data);
    },

    write: obj => {
      clearTimeout(timer);
      count = (count || 0) + 1;
      timer = setTimeout(() => {
        console.log("localstroage SAVE",
          count,
          time()
        );
        localStorage[ns] = JSON.stringify(obj);
        count = 0;
      }, delay);
    }
  };
}

export default {
  getHash, //
  uuid,
  deepEqual,
  storage,
  inflate,
  keysPressed,
  time
};