import backupRestore from './backupRestore';

test('Can establish the stroage context', () => {
    backupRestore.context({ a: '1', b: '2' });
    const keys = backupRestore.keys();
    expect(keys).toEqual(['a', 'b']);
});

test('existing data can be purged with a prefix namespace', () => {
    backupRestore.context({ a: '1', b: '2', c: '3', aa: 11, ab: 22, ac: 33 });
    expect(backupRestore.keys()).toEqual(['a', 'b', 'c', 'aa', 'ab', 'ac']);

    backupRestore.purge('abc');
    expect(backupRestore.keys()).toEqual(['a', 'b', 'c', 'aa', 'ab', 'ac']);

    backupRestore.purge('a');
    expect(backupRestore.keys()).toEqual(['b', 'c']);

    backupRestore.purge();
    expect(backupRestore.keys()).toEqual([]);
});

test('check the integrety of the incoming json', () => {
    const json = require('./backupRestore.test.1.json');
    const keys = Object.keys(json);
    expect(json).toBeDefined();
    expect(keys).toHaveLength(6);

    const articles = JSON.parse(json['BAK--articles']);
    const settings = JSON.parse(json['BAK--settings']);
    const previous = JSON.parse(json['BAK--previous']);

    expect(articles).toBeDefined();
    expect(articles).toHaveLength(2);
    expect(articles[0].guid).toBe('c16992278a301002');
    expect(articles[1].guid).toBe('a0123456789abcde');

    const articleA = `BAK--${articles[0].guid}`;
    const articleB = `BAK--${articles[1].guid}`;

    expect(json[articleA]).toBeDefined();
    expect(json[articleB]).toBeDefined();
    expect(json[articleA]).toHaveLength(332);
    expect(json[articleB]).toHaveLength(1109);

    expect(previous).toBeDefined();
    expect(previous).toBe('c16992278a301002');
    expect(articles[0].guid).toBe('c16992278a301002');

    expect(settings).toBeDefined();
    expect(Object.keys(settings)).toHaveLength(7);
    ['modifiers', 'values', 'width', 'guid', 'previous'].forEach(k =>
        expect(settings[k]).toBeDefined()
    );
});

test('restore the data to localStorage', () => {
    const json = require('./backupRestore.test.1.json');
    backupRestore.context({});
    const result = backupRestore.restore('rewrite', json);
    const keys = Object.keys(result);

    expect(keys).toHaveLength(4);
    expect(result['rewrite-articles']).toBeDefined();
    expect(result['rewrite-settings']).toBeDefined();
    expect(result['rewrite-c16992278a301002']).toBeDefined();
    expect(result['rewrite-a0123456789abcde']).toBeDefined();

    const c16992278a301002 = JSON.parse(result['rewrite-c16992278a301002']);
    const a0123456789abcde = JSON.parse(result['rewrite-a0123456789abcde']);

    expect(c16992278a301002.meta).toBeDefined();
    expect(c16992278a301002.data).toBeDefined();

    expect(c16992278a301002.meta.uuid).toBe('c16992278a301002');
    expect(a0123456789abcde.meta.uuid).toBe('a0123456789abcde');

    expect(c16992278a301002.meta.name).toBe('Untitled');
    expect(a0123456789abcde.meta.name).toBe('Startup example');

    expect(c16992278a301002.data).toHaveLength(5);
    expect(a0123456789abcde.data).toHaveLength(9);
});
