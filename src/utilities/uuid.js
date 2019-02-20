let snA = 0;
let snB = 0;

// fractionally slow runtime
// --------------------------
// function v1() {
//   const a = (((snA += 1) % 6) + 10).toString(16);
//   const b = new Date().valueOf().toString(16);
//   const c = 1000 + ((snB += 1) % 999);
//   return `${a}${b}${c}`;
// }

function v2() {
  // alpha + timestamp + 1000 (1+11+4=16)
  return (
    (((snA += 1) % 6) + 10).toString(16) +
    new Date().valueOf().toString(16) +
    (1000 + ((snB += 1) % 999)) +
    ""
  );
}

const uuid = v2;
export default uuid;

/** QUOKKA INLINE UNIT TEST  * /

var max = 10000000;
console.time("v");
for(var i = 0; i < max; i ++) v1();
console.timeEnd("v");

console.time("v");
for(var i = 0; i < max; i ++) v2();
console.timeEnd("v");
console.log(new Date())

/** */
