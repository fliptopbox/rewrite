import deepEqual from "deep-is";
import getHash from "./getHash";
import uuid from "./uuid";
import inflate from "./inflate";

function storage() {
  const ns = "rewrite";

  return {
    read: () => {
      const data = localStorage[ns] || null;
      return data && JSON.parse(data);
    },
    write: obj => (localStorage[ns] = JSON.stringify(obj))
  };
}

export default { getHash, uuid, deepEqual, storage, inflate };
