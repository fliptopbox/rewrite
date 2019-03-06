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

    Object.keys(obj).forEach((k, i) => {
        const key = k.replace(/^(BAK-+)?/, `${ns}-`);
        localStorage[key] = obj[k];
    });
}

function purge(ns = '') {
    Object.keys(localStorage).forEach(k =>
        k.indexOf(ns) + 1 ? delete localStorage[k] : null
    );
}

export default {
    backup,
    restore,
    purge,
};
