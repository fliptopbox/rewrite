let localStorage = window.localStorage;

function backup(ns = '') {
    let bak = null;
    const re = new RegExp(`^${ns}`);

    Object.keys(localStorage)
        .filter(k => re.test(k))
        .forEach((k, i) => {
            const key = k.replace(re, '');
            bak = bak || {};
            bak[`BAK-${key}`] = localStorage[k];
        });

    return bak;
}

function restore(ns = '', obj) {
    if (!obj) return;
    let prefix = ns ? `${ns}-` : '';
    const rows = {
        articles: [],
        settings: {},
    };

    Object.keys(obj).forEach((k, i) => {
        const key = k.replace(/(^[^-]+-+)/, '');
        const value = obj[k];

        let row = /^[[{'"]/.test(value) ? JSON.parse(obj[k]) : value;
        const now = new Date().valueOf();

        if (/[a-z0-9]{16}$/.test(k)) {
            if (!('data' in row || 'meta' in row)) {
                //console.log('old schema ....... ');
                row = {
                    // provisionsal meta data
                    // this will be updated by the articles object
                    meta: {
                        uuid: key,
                        name: `Untitled ${i}`,
                        username: null,
                        created: now,
                        modified: now,
                        wordtarget: 0,
                    },
                    data: row,
                };
            }
            rows[key] = row;
            return;
        }

        // apart from actual data and these records
        // all other rows are discarded
        if (/(settings|articles)$/i.test(key)) {
            rows[key] = row;
        }
    });

    // we need to transpose the row metadata and articles metadata
    // and elect an article as the "current" article as a setting prop
    // and update each rows modified date.
    const derived = [];
    rows.articles.forEach((r, i) => {
        const id = r.uuid || r.guid;
        const now = new Date().valueOf();

        rows[id].meta = { ...r };
        rows[id].meta.uuid = id;
        rows[id].meta.modified = now;

        delete rows[id].meta.opened;

        // append the derived meta Object
        derived.push({
            uuid: id,
            name: r.name,
            modified: now,
            created: now,
        });
    });
    // replace the original collection with the new derived array.
    rows.articles = derived;

    // examine the settings and ensure there is a "current" value
    const { previous, current } = rows.settings;
    rows.settings.current = previous || current || derived[0].uuid;
    delete rows.settings.previous; // deprecated former name
    delete rows.settings.settings; // a nesting precaution

    // clean up illegal keys eg. {0: "a", 1: "b" ...}
    // properties are expected to be alpha word strings ONLY
    Object.keys(rows.settings).forEach(r => {
        if (/^[0-9]+$/.test(r)) {
            // console.log('delete invalid key [%s]', r);
            delete rows.settings[r];
        }
    });

    // finally save the coersed schema to disk
    // articles Collection, settings Object and article Object(s)
    Object.keys(rows).forEach(r => {
        const obj = rows[r];
        const string = JSON.stringify(obj);
        localStorage[`${prefix}${r}`] = string;
    });

    return localStorage;
}

function keys() {
    return Object.keys(localStorage);
}

function purge(ns = '') {
    Object.keys(localStorage).forEach(k =>
        k.indexOf(ns) + 1 ? delete localStorage[k] : null
    );
}
function context(object) {
    // set the context of localstrorage
    // this is mostly for unit testing
    localStorage = object;
}

export default {
    context,
    backup,
    restore,
    purge,
    keys,
};
