// download a JSON file

const mimes = {
    // key      mime    extension
    json: ["json", "json"],
    text: ["text", "txt"],
    markdown: ["text", "md"]
};

function download(object) {
    const { name, id, data, type = "json", appendId = true } = object;
    const [mime, ext] = mimes[type];
    const sufix = appendId ? `-${id}` : ``;
    const filename = `${name}${sufix}.${ext}`;
    const text = type === "json" ? JSON.stringify(data) : data;

    const element = document.createElement("a");
    const payload = encodeURIComponent(text);

    element.setAttribute("href", `data:text/${mime};charset=utf-8,${payload}`);
    element.setAttribute("download", `${filename}`);
    element.style.display = "none";

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

export default download;
