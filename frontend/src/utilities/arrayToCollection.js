//! import marked from 'marked';
//! import markdown from './markdown';

import readability from 'readability-meter';
export default arrayToCollection;

//! marked.setOptions({ headerIds: false });o

/*

{
    html: String (rendered markdown)
    text: String (plaintext)
    inactive: Boolean (derived by RegEx)
    classnames: Array (of Strings)
    readability: Object

}

9 100-90.00    very-easily
8 90.0–80.0   easy
7 80.0–70.0   fairly-easy
6 70.0–60.0   plain-english
5 60.0–50.0   fairly-difficult
4 50.0–30.0   difficult
3 30.0–00.0    very-difficult


*/
const ratings = [
    'very-easy',
    'easy',
    'fairly-easy',
    'plain-english',
    'fairly-difficult',
    'difficult',
    'very-difficult',
];

function rating(row = '') {
    if (!row) return { score: null, name: '' };

    let { score } = readability.ease(`${row}`);
    let int = parseInt(score / 10, 10); // eg. 25.34234234 = 2
    let norm; // normalize to array index
    norm = Math.min(int, 10);
    norm = Math.max(3, norm);
    norm = 10 - norm - 1;
    norm = Math.max(0, norm);

    //console.log(1111, parseInt(score, 10), int, norm, ratings[norm]);
    return { score: norm, name: ratings[norm || 0] };
}

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

        const { name } = rating(obj.text);
        if (name) {
            obj.classnames = obj.classnames || [];
            obj.classnames.push(`read-${name}`);
        }
        return obj;
    });
}

// recursively unwrapp the nested tags
// eg. <a><bc>def</bc></a> ==> def
// function unwrap(string = '') {
//     const re = new RegExp(`^<([^>]+)>(.*)</\\1>$`, 'gm');
//     return re.test(string) ? unwrap(string.replace(re, '$2')) : string;
// }
