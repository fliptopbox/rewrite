//

let timer = null;
const ms = 250;

export default function(string = null) {
  let keyHistory = [...this.keyHistory];

  if (!string) return (this.keyHistory = []);

  keyHistory.push(string);

  timer && clearTimeout(timer);
  timer = setTimeout(() => (this.keyHistory = []), ms);

  return (this.keyHistory = [...keyHistory]);
}
