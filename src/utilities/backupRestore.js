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
        const key = k.replace('BAK-', ns);
        localStorage[key] = obj[k];
    });
}

export default {
    backup,
    restore,
};
