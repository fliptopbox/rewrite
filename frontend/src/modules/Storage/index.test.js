import u from '../../utilities/';
import Storage from './';

function schema(object) {
    const attr = ['uuid', 'name', 'created', 'modified'];
    attr.forEach(expect(object).toHaveProperty);
}

function dataExample() {
    return Object.assign(
        {},
        {
            localStorage: {
                'rewrite-settings': JSON.stringify({
                    current: 'a123',
                }),
                'rewrite-a123': JSON.stringify({
                    meta: {
                        name: 'test',
                        uuid: 'a123',
                        created: 123,
                        modified: 321,
                    },
                    data: [{ text: 'test' }],
                }),
                'rewrite-articles': JSON.stringify([
                    {
                        name: 'test',
                        uuid: 'a123',
                        created: 123,
                        modified: 321,
                    },
                ]),
            },
        }
    );
}

// jsdom does not support localStroage
// here is a polyfill object for testing
test('predictable file name', () => {
    const proxy = u.storage.bind({ localStorage: {} });
    const storage = new Storage(proxy);
    expect(storage.filename()).toBeUndefined();
    expect(storage.filename('a123')).toBe('a123');
    expect(storage.filename('a123', 'b')).toBe('b-a123');
});

test('there are no articles', () => {
    const proxy = u.storage.bind({ localStorage: {} });
    const storage = new Storage(proxy);
    expect(storage.list()).toBeNull();
});

test('there is one article', () => {
    const proxy = u.storage.bind(dataExample());
    const storage = new Storage(proxy);
    const array = storage.list();
    expect(array).toHaveLength(1);
    schema(array[0]);

    const uuid = array[0].uuid;
    const article = storage.read(uuid);
    expect(uuid).toBe('a123');
    expect(article).toBeDefined();
    expect(article.data).toBeDefined();
    expect(article.data).toEqual([{ text: 'test' }]);

    expect(article.meta).toBeDefined();
    schema(article.meta);
});

test('initialize will create the initial article', () => {
    const proxy = u.storage.bind({ localStorage: {} });
    const storage = new Storage(proxy);
    expect(storage.list()).toBeNull();

    const article = storage.initilize();
    const list = storage.list();
    expect(list).toHaveLength(1);
    expect(list[0]).toBeDefined();

    expect(article).toHaveProperty('meta');
    expect(article).toHaveProperty('data');

    const attr = ['uuid', 'name', 'created', 'modified'];
    attr.forEach(expect(list[0]).toHaveProperty);
    attr.forEach(expect(article.meta).toHaveProperty);
});

test('initialize returns first available article', () => {
    const proxy = u.storage.bind(dataExample());
    const storage = new Storage(proxy);
    expect(storage.list()).not.toBeNull();
    //expect(storage.current).toBeNull();

    const article = storage.initilize();
    ['meta', 'data'].forEach(expect(article).toHaveProperty);
    schema(article.meta);
});

test('create will create new articles', () => {
    const proxy = u.storage.bind({ localStorage: {} });
    const storage = new Storage(proxy);
    expect(storage.list()).toBeNull();

    storage.create();
    storage.create(null, 'One', [1]);
    storage.create(null, 'Two', [1]);

    const list = storage.list();
    expect(list).toHaveLength(2);
    expect(list[0].name).toBe('One');
    expect(list[1].name).toBe('Two');

    list.forEach(o => {
        const { uuid } = o;
        const a = storage.read(uuid);
        expect(uuid).toHaveLength(16);
        expect(a).not.toBeNull();
        expect(a.data).toBeDefined();
        expect(a.meta).toBeDefined();
    });
});

test('reading from strorage works for existing files', () => {
    const proxy = u.storage.bind(dataExample());
    const storage = new Storage(proxy);

    expect(storage.list()).toHaveLength(1);
    expect(storage.read('a123')).toBeDefined();
    expect(storage.read('x123')).toBeNull();
    expect(storage.create('x123', 'Test', [{ a: 1 }])).toBeDefined();
    expect(storage.read('x123')).toBeDefined();
    expect(storage.list()).toHaveLength(2);
});

test('Writing data creates a predictable schema', () => {
    const proxy = u.storage.bind({ localStorage: {} });
    const storage = new Storage(proxy);
    expect(storage.write()).toBeNull();

    const malformed = storage.write([{ a: 1 }]);
    expect(malformed).toBeNull();

    const wellformed = storage.create('a123', 'Text', [{ a: 1 }]);
    expect(wellformed).toBeDefined();
    schema(wellformed.meta);
    expect(storage.current.meta.uuid).toBe('a123');
    expect(storage.current.data).toEqual([{ a: 1 }]);

    const prev = storage.write([{ a: 2 }]);
    expect(prev).toBeDefined();
    //expect(prev.data).toEqual([{ a: 2 }]);
});

test('you can delete existring records', () => {
    const proxy = u.storage.bind(dataExample());
    const storage = new Storage(proxy);

    expect(storage.list()).toHaveLength(1);
    expect(storage.delete('a123')).toBe(true);
    expect(storage.list()).toHaveLength(0);
});

test('An article can be renamed', () => {
    const proxy = u.storage.bind(dataExample());
    const storage = new Storage(proxy);
    const uuid = 'a123';

    expect(storage.rename()).toBeUndefined();
    expect(storage.rename('a123')).toBeUndefined();
    expect(storage.rename('a123', 'new name')).toBe(true);

    expect(storage.list()).toHaveLength(1);
    schema(storage.list()[0]);

    expect(storage.list()[0].name).toBe('new name');
});

test('Creating an article with existing UUID, replaces the former', () => {
    const proxy = u.storage.bind({ localStorage: {} });
    const storage = new Storage(proxy);

    storage.create('a123', 'Text', [{ a: 1 }]);
    expect(storage.list()[0].name).toBe('Text');

    storage.create('a123', 'Text 2', [{ a: 1 }]);
    expect(storage.list()).toHaveLength(1);
    expect(storage.list()[0].name).toBe('Text 2');
});

test('Creating an article will make it the current Object', () => {
    const proxy = u.storage.bind({ localStorage: {} });
    const storage = new Storage(proxy);
    expect(storage.current).toBeNull();
    storage.create('a123', 'Text', [{ a: 1 }]);
    expect(storage.current).toBeDefined();
    schema(storage.current.meta);
    expect(storage.current.meta.uuid).toBe('a123');

    storage.create('a456', 'Text', [{ a: 1 }]);
    expect(storage.current).toBeDefined();
    schema(storage.current.meta);
    expect(storage.current.meta.uuid).toBe('a456');
});

test('Deleting the current article will select the first', () => {
    const proxy = u.storage.bind({ localStorage: {} });
    const storage = new Storage(proxy);
    storage.create('a123', 'Text', [{ a: 1 }]);
    storage.create('a456', 'Text', [{ a: 1 }]);
    storage.create('a789', 'Text', [{ a: 1 }]);
    expect(storage.list()).toHaveLength(3);
    expect(storage.current.meta.uuid).toBe('a789');

    expect(storage.delete()).toBe(false);
    expect(storage.delete('a456')).toBe(true);

    expect(storage.list()).toHaveLength(2);
    expect(storage.current.meta.uuid).toBe('a789');

    expect(storage.delete('a789')).toBe(true);
    expect(storage.current.meta.uuid).toBe('a123');
});
