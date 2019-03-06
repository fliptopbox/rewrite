function wordcount(value) {
    value = String(value || '');

    if (!value) return 0;

    // collapse hyphenations into one entity
    value = value.replace(/(\w)[-]+(\w)/g, '$1$1');

    // normalize non-word chars .,:; etc.
    value = value.replace(/[\W"]+/g, ' ');

    // remove double spaces
    value = value.replace(/(\s{1,})/g, ' ');

    // remove trailing spaces
    value = value.trim();

    return value.length ? value.split(' ').length : 0;
}

export default wordcount;
