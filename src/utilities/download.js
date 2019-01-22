// download a JSON file

function download(object) {
  const { name, id, data } = object;
  const filename = `${name}-${id}`;
  const text = JSON.stringify(data);

  const element = document.createElement("a");
  const payload = encodeURIComponent(text);

  element.setAttribute("href", "data:text/json;charset=utf-8," + payload);
  element.setAttribute("download", `${filename}.json`);
  element.style.display = "none";

  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export default download;
