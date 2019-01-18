
import startup from "./startup";

class Storage {

    constructor() {
        this.path = "article";

    }

    // reads from localStorage
    // guid: unique key
    // example: rewrite-article-ace123ace123
    read(guid) {
        const {path} = this;
        const fileId = [path, guid].join("-");

        // read path from persisted datastore
        const object = {};
        return object;
    }

    // persists to localStorage (asynchronislly)
    write(object) {
    
        console.log("STORAGE", object);
    
    }

    // import
    // parses JSON and plainText into a Article schema
    // @value String or Object literal
    import (value) {}

    // export
    // returns Object literal of Article schema
    export () {}


    // list
    // returns an array of file metadata
    // guid, name, created, opended, filesize ...
    // the list can be filtered by regExp
    list (filter) {}

    // open
    // presents a file picker to load an external file
    // same as import, without id or plainText string
    open () {}

    // save
    // causes a download dialoge box to appear
    // the filename derived from the currently selected file
    save () {}

    // rename
    // assigns a new filename to the given guid
    rename (guid, filename) {}

    // delete
    // deletes the associated files by guid
    delete (array) {}


    // initialize
    // attempts to load previous article,
    // or first article or blank or welcome page
    initilize () {
        return startup;
    }


}

export default Storage;
