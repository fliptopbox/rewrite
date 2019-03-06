const settings = require("./config");

function htmlToStringArray(children, options = {}) {
  const { prefixToken, className } = { ...settings, ...options };

  return [...children].map(el => {
    const { innerText, classList } = el;
    const is_comment = classList.contains(className);
    const prefix = is_comment ? prefixToken : "";

    return `${prefix}${innerText.trim()}`;
  });
}

export default htmlToStringArray;
