const comment = new RegExp("^[>]s?", "g");

function arrayToHtml(array) {
  // returns DOM string
  // parse comment chars to className "comment"

  return [...array]
    .map(text => {
      const className = comment.test(text) ? ` class="comment"` : "";
      const value = text ? text.replace(comment, "").trim() : "<br />";

      return `<div${className} tabindex="-1">${value}</div>`;
    })
    .join("\n")
    .toString();
}

export default arrayToHtml;
