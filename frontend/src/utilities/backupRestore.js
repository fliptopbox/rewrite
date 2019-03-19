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
    const derived = [];
    rows.articles.forEach((r, i) => {
        const id = r.uuid || r.guid;
        rows[id].meta = { ...r };
        rows[id].meta.uuid = id;
        rows[id].meta.modified = r.opened || r.modified;

        derived.push({
            uuid: id,
            modified: r.opened || r.modified,
            created: r.created,
            name: r.name,
        });
    });
    // replace the original with the derived array.
    rows.articles = derived;

    const { previous, current } = rows.settings;
    rows.settings.current = previous || current;
    delete rows.settings.previous;
    delete rows.settings.settings;

    // clean up illegal keys
    Object.keys(rows.settings).forEach(r => {
        if (/^[0-9]+$/.test(r)) {
            // console.log('delete invalid key [%s]', r);
            delete rows.settings[r];
        }
    });

    // finally save the coersed schema to disk
    Object.keys(rows).forEach(
        r => (localStorage[`${prefix}${r}`] = JSON.stringify(rows[r]))
    );

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
