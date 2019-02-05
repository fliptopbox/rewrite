// download a JSON file

const mimes = {
  // key      mime    extension
  json: ["json", "json"],
  text: ["text", "txt"],
  markdown: ["text", "md"]
};

function download(object) {
  const { name, id, data, type = "json" } = object;
  const [mime, ext] = mimes[type];
  const filename = `${name}-${id}`;
  const text = JSON.stringify(data);

  const element = document.createElement("a");
  const payload = encodeURIComponent(text);

  element.setAttribute("href", `data:text/${mime};charset=utf-8,${payload}`);
  element.setAttribute("download", `${filename}.${ext}`);
  element.style.display = "none";

  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export default download;
