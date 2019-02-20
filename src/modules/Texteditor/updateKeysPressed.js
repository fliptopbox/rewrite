let timer = null; // timer symbol
let keyHistory = []; // stack of keyspressed
const reset = 250; // truncate history miliseconds

export default function(e, join) {
  const string = e.key.trim() || e.code;

  keyHistory.push(string);

  timer && clearTimeout(timer);
  timer = setTimeout(() => (keyHistory = []), reset);

  // retrun catenated strings OR array literal?
  return join ? keyHistory.join("") : [...keyHistory];
}
