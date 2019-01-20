import collectionToHtml from "../utilities/collectionToHtml";
import htmlToCollection from "../utilities/htmlToCollection";

let _collection;

class Parse {
  constructor(value = null, options = {}) {
    this.options = {
      flag: "inactive",
      re: /^(\s+)?[>?!/]+(\s+)?/,
      unwrap: true, // unwrap hard breaks
      tag: "p",
      br: "<br/>",
      ...options
    };

    // cast the value as Object literal
    if (!value) value = "";

    const constructor = value.constructor;
    const type =
      (constructor === String && "string") ||
      (constructor === Array && "array") ||
      (constructor === HTMLCollection && "html");
    ("unknown");

    // determine input value and parse as
    // collection schema
    switch (type) {
      case "string":
        // this is a MD of txt file convert it to collection
        //? permit fountain screenplay detection

        value = linebreaks(value);
        value = unwrap(value);
        value = arrayToCollection(value);
        break;

      case "array":
        // this can be either a simple text array
        // or a previously fromatted collection (eg. from disk)
        value = arrayToCollection(value);
        break;

      case "html":
        // this is a collection of HTML nodes
        value = htmlToCollection(value);
        break;

      default:
        break;
    }
    // assign to private value
    _collection = [...value];
  }

  toHTML() {
    const { options } = this;
    return collectionToHtml.call(this, _collection, options);
  }

  toText() {
    const array = toTextArray(_collection);
    let string = array.join("\n");
    string = string.replace(/(\s+)?$/g, "");

    return string;
  }

  toArray() {
    return toTextArray(_collection);
  }

  toCollection() {
    return _collection;
  }
}

export default Parse;

/** * /

let q = new Parse("alpha\nbravo charlie\n\ndelta");
q.toCollection(); //?
q.toText(); //?

q = new Parse([
  { text: "alpha", versions: ["alpha", "> bravo", "> charlie"] },
  { text: "" },
  { text: "", versions: ["> alpha", "> bravo", "> charlie"] }
]);
q.toHTML(); //?

/** */

function toTextArray(collection) {
  return [...collection].map(o => `${o.text}`);
}

function linebreaks(plaintext = "") {
  // remove carridge returns (aka CrLf => Lf)
  if (/\r/.test(plaintext)) plaintext = plaintext.replace(/\r/gm, "");
  return plaintext;
}

function unwrap(text = "") {
  // unwrap hardline breaks.
  let catenated = text;
  catenated = catenated.split(/\n{2,}/gm);
  catenated = catenated.map(
    s =>
      s
        .replace(/\n+/g, " ")
        .replace(/\s{2,}/g, " ")
        .trim() || ""
  );
  // normalize the paragraph breaks
  catenated = catenated.join("\n\n");
  catenated = catenated.split(/\n/g);

  return [...catenated];
}

function arrayToCollection(array) {
  return array.map(row => {
    return typeof row === "string" ? { text: `${row}`.trim() } : row;
  });
}
