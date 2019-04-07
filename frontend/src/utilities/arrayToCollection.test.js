import arrayToCollection from './arrayToCollection';
// import config from '../config';

test('predictable json schema', () => {
    let array = ['string of plain text.'];
    let result = arrayToCollection(array)[0];
    console.log(result);
    expect(result).toHaveProperty('classnames');
    expect(result.html).toBeNull();
    expect(result.inactive).toBe(false);
    expect(result.text).toBe('string of plain text.');
});

test('an inactive line', () => {
    let array = ['> string of plain text.'];
    let result = arrayToCollection(array)[0];
    expect(result).toHaveProperty('classnames');
    expect(result.html).toBeNull();
    expect(result.inactive).toBe(true);
    expect(result.text).toBe('> string of plain text.');
});

test('unbalanced nested tags', () => {
    let array = ['_string_ of **plain** text.'];
    let result = arrayToCollection(array)[0];
    expect(result).toHaveProperty('classnames');
    expect(result.html).toBeNull();
    expect(result.inactive).toBe(false);
    expect(result.text).toBe('_string_ of **plain** text.');
});
