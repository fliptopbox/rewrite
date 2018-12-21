let article;

function wordCount() {
  article = article || document.querySelector("article");
  const { innerText } = article;
  const string = innerText.replace(/\n+/g, " ");

  return string.split(" ").length;
}

export default wordCount;
