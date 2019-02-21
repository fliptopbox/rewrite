import uuid from './uuid';

test('uuid generates 100k unique strings 16 chars length', () => {
    const dict = {};
    let i = 1000000;
    let x = i;
    while (i--) dict[uuid()] = true;

    const keys = Object.keys(dict);
    expect(keys.length).toBe(x);

    // must start alpha, then hex characters, total 16
    const hex16 = /^[a-z][0-9a-z]{15}$/;
    expect(keys.some(id => !hex16.test(id))).toBe(false);
});
