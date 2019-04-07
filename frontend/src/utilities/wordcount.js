function wordcount(string) {
    string = String(string || '');

    if (!string) return 0;

    // collapse hyphenations into one entity
    string = string.replace(/(\w)[-]+(\w)/g, '$1$1');

    // normalize non-word chars .,:; etc.
    string = string.replace(/[\W"]+/g, ' ');

    // remove double spaces
    string = string.replace(/(\s{1,})/g, ' ');

    // remove trailing spaces
    string = string.trim();

    return string.length ? string.split(' ').length : 0;
}

export default wordcount;
