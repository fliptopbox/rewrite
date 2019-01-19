const register = {
  /*
        {
            ns: String // namespace
            fn: Function // callback
            ns: Number // milisecond delay
            t: Symbol // placeholder for Timer
            n: Number // counts executions
        }
    */
};

function defer(ns, fn, ms = 250, logs = false) {
  if (!ns || !fn) return;

  // create non-existant register
  if (!register[ns]) {
    logs && console.log("CREATE REGISTER [%s]", ns);
    register[ns] = { ns, fn, ms, t: null, n: 0, verbose: logs === true };
  }

  // clear existing timeout & create new one
  let { verbose } = register[ns];
  register[ns].n += 1; //?

  verbose && console.log("CALLING REGISTER [%s]", ns, register[ns].n);
  clearTimeout(register[ns].t);
  register[ns].t = setTimeout(() => {
    verbose && console.log("EXECUTING REGISTER [%s]", ns, register[ns].n);
    delete register[ns];
    return fn();
  }, ms);
}

/** QUOKKA INLINE UNIT TEST * /
let q = 0;
const mms = 1500;
const callback = () => {
  console.log("[%s]", (q += 1));
};

// this function should only be called twice.
defer("abc", callback, mms, true);
defer("xyz", callback, mms);

defer("abc", callback, mms);
defer("xyz", callback, mms);

defer("abc", callback, mms);
defer("xyz", callback, mms);

defer("abc", callback, mms);
defer("xyz", callback, mms);

defer("abc", callback, mms);
defer("xyz", callback, mms);

/** */

export default defer;
