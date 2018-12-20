import uuid from './uuid';

function textToCollection(text) {

    const paras = text.split("\n");
    return paras.map((value, n) => ({
        key: n,
        id: value && value.trim() ? uuid() : "",
        text: value || ""
    }));
}


export default textToCollection;