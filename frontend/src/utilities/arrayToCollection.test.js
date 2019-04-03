import arrayToCollection from './arrayToCollection';
// import config from '../config';

test('predictable json schema', () => {
    let array = ['string of plain text.'];
    let expected = [
        {
            classnames: [],
            html: null,
            inactive: false,
            text: 'string of plain text.',
        },
    ];
    let result = arrayToCollection(array);
    expect(result).toEqual(expected);
});

test('an inactive line', () => {
    let array = ['> string of plain text.'];
    let expected = [
        {
            classnames: [],
            html: null,
            inactive: true,
            text: '> string of plain text.',
        },
    ];
    let result = arrayToCollection(array);
    expect(result).toEqual(expected);
});

// test('heading 1 markdown', () => {
//     let array = ['# string of plain text.'];
//     let expected = [
//         {
//             classnames: ['md-h1'],
//             html: null,
//             inactive: false,
//             text: '# string of plain text.',
//         },
//     ];
//     let result = arrayToCollection(array);
//     expect(result).toEqual(expected);
// });

test('unbalanced nested tags', () => {
    let array = ['_string_ of **plain** text.'];
    let expected = [
        {
            classnames: [],
            html: null,
            inactive: false,
            text: '_string_ of **plain** text.',
        },
    ];
    let result = arrayToCollection(array);
    expect(result).toEqual(expected);
});
