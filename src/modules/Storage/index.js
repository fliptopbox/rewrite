import uuid from "../../utilities/uuid";
import download from "../../utilities/download";
import readTextFile from "../../utilities/readTextFile";
const startup = require("./startup.json");

class Storage {
  constructor(storage) {
    this.key = null; // the current article's GUID
    this.articles = this.list;
    this.storage = storage;
    this.uuid = uuid;
    this.current = null; // currently open article

    this.create = createArticle.bind(this);
  }

  filename(guid, path) {
    if (!guid) return;
    return [path, guid].filter(s => s).join("-");
  }

  // reads from localStorage
  // guid: unique key
  // example: rewrite-article-ace123ace123
  read(guid) {
    if (!guid) {
      this.current = null;
      return null;
    }

    const { storage, filename } = this;
    const articles = storage("articles");
    const file = storage(filename(guid)).read();

    if (!file) {
      this.current = null;
      return null;
    }

    const meta = articles.read().find(obj => obj.guid === guid);
    const current = { ...meta, data: file, previous: guid };

    return (this.current = current);
  }

  // persists to localStorage
  write(object) {
    if (!object) return null;

    const { current, filename, storage } = this;
    const guid = current && current.guid;

    if (!guid) return null;

    const localkey = filename(guid);
    const local = storage(localkey);

    local.write(object);
    local.backup();

    this.current = { ...this.current, data: object };
    return this.current;
  }

  // import
  // parses JSON and plainText into a Article schema
  // @value String or Object literal
  import(value) {}

  // export
  // returns Object literal of Article schema
  export() {}

  // list
  // returns an array of file metadata
  // guid, name, created, opended, filesize ...
  // the list can be filtered by regExp
  list(filter) {
    const articles = this.storage("articles");
    return articles.read();
  }

  // open
  // presents a file picker to load an external file
  // same as import, without id or plainText string
  open(files, fn) {
    if (!files) {
      console.error("Cant open, require files array");
    }

    // remember read file is async
    return readTextFile(files, function(name, data) {
      // console.log("read text file", name, data);
      return fn(name, data);
    });
  }

  // save
  // causes a download dialoge box to appear
  // the filename derived from the currently selected file
  save(filename) {
    if (!this.current) {
      console.error("No current article to download");
      return;
    }
    const { guid, name, data } = this.current;
    const metadata = {
      id: guid,
      name: filename || name,
      data
    };

    return download(metadata);
  }

  // rename
  // assigns a new filename to the given guid
  rename(guid, filename) {
    if (!guid) return;

    const list = this.list();
    let index = list.findIndex(r => r.guid === guid);
    let articles = this.storage("articles");
    list[index].name = filename;
    articles.write(list);
  }

  // delete this is a test
  // deletes the associated files by guid
  delete(guid) {
    if (!guid) return false;

    const { filename, storage } = this;
    const list = this.list();
    let index = list.findIndex(r => r.guid === guid);
    let articles = storage("articles");
    const previous = storage("previous");
    const collection = articles.read();
    collection.splice(index, 1);
    // const pluck = collection.splice(index, 1);

    articles.write(collection);
    storage(filename(guid)).delete();

    if (previous.read() === guid) {
      previous.delete();
    }
    return true;
  }

  // initialize
  // attempts to load previous article,
  // or first article or blank or welcome page
  initilize() {
    const previous = this.storage("previous").read();
    if (!this.list()) {
      this.create("a0123456789abcde", "Startup example", startup);
    }
    if (previous) {
      this.read(previous);
    }
    return this.current;
  }
}

export default Storage;

function createArticle(guid, name, schema) {
  if (!schema) {
    console.error("Create requires article schema");
    return;
  }

  // generate the initial metadata
  guid = guid || uuid();
  name = name || "Untitled";
  const created = new Date().valueOf();
  const opened = new Date().valueOf();
  const row = { guid, name, created, opened };

  // append to list of articles
  const articles = this.storage("articles");
  const array = articles.read() || [];
  array.push(row);
  articles.write(array);

  // save the article data
  const key = this.filename(guid);
  this.storage(key).write(schema);
  this.storage("previous").write(guid);

  this.current = {
    ...row,
    data: schema,
    previous: guid
  };

  return this.current;
}
