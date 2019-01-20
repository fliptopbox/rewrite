let options = {
  flag: "inactive",
  re: /^(\s+)?[>?!/]+(\s+)?/,
  tag: "p",
  br: "<br/>"
};

function arrayToHtml(array, obj) {
  // update the global parsing settings
  if (obj) {
    options = {
      ...options,
      ...obj
    };
  }

  // no array ... exit
  if (!array) return;

  // shortcut to the settings
  const { flag, re, tag, br } = options;

  // iterare over incoming array of strings
  // output a catenated DOM string (innerHTML)
  return [...array]
    .map(s => {
      let innerText = `${s}`.replace(re, "").trim() || br;
      innerText = typeof s !== "string" ? br : innerText;

      let className = [];

      re.test(s || "") && className.push(flag);

      // s && s.className && className.push(s.className);
      className = className.length ? className.join(" ") : null;
      className = (className && ` class="${className}"`) || "";

      return `<${tag}${className}>${innerText}</${tag}>`;
    })
    .join("\n");
}

export default arrayToHtml;
