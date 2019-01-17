function htmlToCollection(children) {
  const reHtmlTags = /<[^<]+>/gi;
  const array = [...children].map(el => {
    const { innerText = "", innerHTML, dataset, nodeName, classList } = el;

    if (!/(div|p)/i.test(nodeName)) return null;

    const text = (innerText && innerText.trim()) || "";
    const string = text || (innerHTML && innerHTML.replace(reHtmlTags, ""));

    const versions = dataset.versions && JSON.parse(dataset.versions);
    const selected = (classList && classList.contains("selected")) || undefined;
    const obj = {};

    obj.text = string || "";
    versions && (obj.versions = versions);
    selected && (obj.selected = selected);

    return obj;
  });
  return array.filter(row => row);
}

export default htmlToCollection;
