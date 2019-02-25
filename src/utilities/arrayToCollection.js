//! import marked from 'marked';
//! import markdown from './markdown';

export default arrayToCollection;

//! marked.setOptions({ headerIds: false });o

/*

{
    html: String (rendered markdown)
    text: String (plaintext)
    inactive: Boolean (derived by RegEx)
    classnames: Array (of Strings)

}




*/

function arrayToCollection(array, re = /^>/, md = false) {
    return array.map(row => {
        const obj =
            typeof row === 'string'
                ? {
                      html: null, // markdown render
                      text: `${row}`.trim(),
                      inactive: re.test(row),
                      classnames: [],
                  }
                : row;

        /* //! remove markdown ... for now
        if (false && md && obj.text) {
            obj.html = marked(obj.text).replace(/\n+/g, '');
            obj.html = unwrap(obj.html).trim() || null;

            md = markdown(obj.text);
            md.splice(-1, 1);
            md.forEach(val => {
                obj.classnames = obj.classnames || [];
                obj.classnames.push(`md-${val}`);
            });
        }*/
        return obj;
    });
}

// recursively unwrapp the nested tags
// eg. <a><bc>def</bc></a> ==> def
// function unwrap(string = '') {
//     const re = new RegExp(`^<([^>]+)>(.*)</\\1>$`, 'gm');
//     return re.test(string) ? unwrap(string.replace(re, '$2')) : string;
// }
