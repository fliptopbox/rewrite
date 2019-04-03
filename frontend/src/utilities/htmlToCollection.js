import jsonParseSafe from './jsonParseSafe';

function htmlToCollection(children) {
    const reHtmlTags = /<[^<]+>/gi;
    const array = [...children].map(el => {
        const { innerText = '', innerHTML, dataset, nodeName, classList } = el;

        if (!/(div|p)/i.test(nodeName)) return null;

        const text = (innerText && innerText.trim()) || '';
        const string = text || (innerHTML && innerHTML.replace(reHtmlTags, ''));

        // const inactive = classList.contains("inactive");
        // const selected = (classList && classList.contains("selected")) || undefined;
        const versions =
            dataset.versions && jsonParseSafe(dataset.versions, string);
        const obj = {};

        obj.text = string || '';
        versions && (obj.versions = versions);

        // convert all classNames to object keys
        // classList.remove("locked"); // derived is versions exist
        [...classList].forEach(s => (obj[s] = s));

        return obj;
    });
    return array.filter(row => row);
}

export default htmlToCollection;
