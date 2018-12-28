import deepEqual from "deep-is";
import uuid from "./uuid";
import inflate from "./inflate";

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
        console.log("localstroage SAVE", count, time());
        localStorage[ns] = JSON.stringify(obj);
        count = 0;
      }, delay);
    }
  };
}

export default {
  uuid,
  deepEqual,
  inflate,
  storage,
  time
};
