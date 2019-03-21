import uuid from '../../utilities/uuid';
import download from '../../utilities/download';
import readTextFile from '../../utilities/readTextFile';
const startup = require('./startup.json');

class Storage {
    constructor(storage) {
        this.key = null; // the current article's GUID
        this.articles = this.list;
        this.storage = storage;
        this.uuid = uuid;
        this.current = null; // currently open article
        this.syncId = null;
        this.timestamp = null;

        this.create = createArticle.bind(this);
    }

    filename(guid, path) {
        if (!guid) return;
        return [path, guid].filter(s => s).join('-');
    }

    // sets the users syncID to not null
    // this will cause the write method to
    // push updates after the localstroage save
    setSyncProfile(guid = null) {
        console.log('Profile Sync', guid);
        this.syncId = guid;
        this.timestamp = new Date().valueOf();
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
        const s = storage('settings');
        const file = storage(filename(guid)).read();

        if (!file) {
            this.current = null;
            return null;
        }

        if (!file.meta || !file.data) {
            console.error(
                'This article has incorrect schema. Missing meta and data'
            );
            return null;
        }

        //const meta = articles.read().find(obj => obj.guid === guid);
        //const current = { ...meta, data: file, previous: guid };
        let settings = s.read() || {};
        settings.current = file.meta.uuid;
        s.write(settings);

        return (this.current = file);
    }

    // persists to localStorage
    write(object) {
        if (!object) return null;
        console.log('write to filesystem', this.syncId);

        const { current, filename, storage } = this;
        const guid = current && current.guid;

        if (!guid) {
            console.log('no current guid');
            return null;
        }

        const localkey = filename(guid);
        const local = storage(localkey);

        local.write(object, true);
        local.backup();
        // local.push(this.syncId);

        // update last modified date
        const articles = storage('articles');
        let collection = articles.read();

        // find current guid and pluck it out
        const index = collection.findIndex(o => o.guid === guid);
        const recent = collection.splice(index, 1)[0];

        // update timestamp
        recent.opened = new Date().valueOf();

        // place most recently edited article first
        collection = [recent, ...collection];

        // save the updates to local
        articles.write(collection, true);

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
        const articles = this.storage('articles');
        return articles.read();
    }

    // open
    // presents a file picker to load an external file
    // same as import, without id or plainText string
    open(files, fn) {
        if (!files) {
            console.error('Cant open, require files array');
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
            console.error('No current article to download');
            return;
        }
        const { guid, name, data } = this.current;
        const metadata = {
            id: guid,
            name: filename || name,
            data,
        };

        return download(metadata);
    }

    // rename
    // assigns a new filename to the given guid
    rename(uuid, filename) {
        if (!uuid || !filename) return;

        const list = this.list();
        let index = list.findIndex(r => r.uuid === uuid);
        let articles = this.storage('articles');
        list[index].name = filename;
        articles.write(list);

        return true;
    }

    // delete
    // deletes the associated files by guid
    // and refreshes the articles list
    delete(guid) {
        if (!guid) {
            console.log('Cant delete [%s]', guid);
            return false;
        }

        const { storage } = this;
        const { meta = null } = this.current || {};
        const list = this.list().filter(r => r.uuid !== guid);
        storage('articles').write(list);
        storage(guid).delete();

        if (meta && meta.uuid === guid) {
            console.warn('Deleting current article %s', guid);
            this.read(this.list()[0].uuid);
        }

        return true;
    }

    // initialize
    // attempts to load previous article,
    // or first article or blank or welcome page
    initilize() {
        const uuid = startup.meta.uuid;
        const name = startup.meta.name;

        const settings = this.storage('settings');
        const { current = null } = settings.read() || {};

        if (!this.list()) {
            this.create(uuid, name, startup);
            settings.write({ current: uuid });
            console.warn('create default example article [%s]', uuid);
        }

        if (current) {
            this.read(current);
        }

        return this.current;
    }
}

export default Storage;

function createArticle(article_id, name, schema) {
    if (!schema) {
        console.error('Create requires article schema');
        return;
    }

    // generate the initial metadata
    article_id = article_id || uuid();
    name = name || 'Untitled';
    const created = new Date().valueOf();
    const modified = new Date().valueOf();
    const meta = { uuid: article_id, name, created, modified };

    // append to list of articles
    const articles = this.storage('articles');
    const array = articles.read() || [];

    const exists = array.findIndex(a => a.uuid === article_id);

    // ensure the uuid is unique
    // existing uuid will be updated
    if (array && array.length && exists + 1) {
        console.warn('UUID exists. Replace %s', article_id);
        array.splice(exists, 1);
    }

    array.push(meta);
    articles.write(array);

    this.current = {
        meta,
        data: schema,
    };

    // save the article data
    const key = this.filename(article_id);
    this.storage(key).write(this.current);

    return this.current;
}
