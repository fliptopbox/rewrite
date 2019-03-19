import u from '../../utilities/';
import Storage from './';

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

test('there is one artilce', () => {
    const proxy = u.storage.bind({
        localStorage: {
            'rewrite-a123': '1',
            'rewrite-articles': JSON.stringify([
                {
                    name: 'test',
                    uuid: 'a123',
                    created: 123,
                    modified: 321,
                },
            ]),
        },
    });
    const storage = new Storage(proxy);
    const array = storage.list();
    expect(array).toHaveLength(1);
    expect(array[0]).toHaveProperty('name');
    expect(array[0]).toHaveProperty('uuid');
    expect(array[0]).toHaveProperty('created');
    expect(array[0]).toHaveProperty('modified');

    const uuid = array[0].uuid;
    const article = storage.read(uuid);
    expect(uuid).toBe('a123');
    expect(article).toBeDefined();
    expect(article.data).toBe('1');
    expect(article.previous).toBe('a123');
});

test('initialize will create the initial article', () => {
    const proxy = u.storage.bind({ localStorage: {} });
    const storage = new Storage(proxy);
    expect(storage.list()).toBeNull();

    const article = storage.initilize();
    const props = ['uuid', 'data', 'previous', 'name', 'modified', 'created'];
    expect(article).toBeDefined();
    props.forEach(expect(article).toHaveProperty);
});

test('initialize returns first available article', () => {
    const proxy = u.storage.bind({
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
    });
    const storage = new Storage(proxy);
    expect(storage.list()).not.toBeNull();
    //expect(storage.current).toBeNull();

    const article = storage.initilize();
    //const props = ['uuid', 'data', 'previous', 'name', 'modified', 'created'];
    const props = ['meta', 'data'];
    expect(article).toBeDefined();
    //props.forEach(expect(article).toHaveProperty);
    //expect(storage.current).not.toBeNull();
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
        expect(a).toBeDefined();
        expect(a.data[0]).toBe(1);
    });
});

test('reading from strorage works for existing files', () => {
    const proxy = u.storage.bind({
        localStorage: {
            'rewrite-previous': 'a123',
            'rewrite-a123': JSON.stringify([{ text: 'test' }]),
            'rewrite-articles': JSON.stringify([
                {
                    name: 'test',
                    guid: 'a123',
                    created: 123,
                    modified: 321,
                },
            ]),
        },
    });
    const storage = new Storage(proxy);

    expect(storage.list()).toHaveLength(1);
    expect(storage.read('a123')).toBeDefined();
    expect(storage.read('x123')).toBeNull();
    expect(storage.create('x123', 'Test', [{ a: 1 }])).toBeDefined();
    expect(storage.read('x123')).toBeDefined();
    expect(storage.list()).toHaveLength(2);
});

test("writing data without a current article won't work", () => {
    const proxy = u.storage.bind({ localStorage: {} });
    const storage = new Storage(proxy);
    expect(storage.write()).toBeNull();
    expect(storage.write([{ a: 1 }])).toBeNull();

    expect(storage.create('a123', 'Text', [{ a: 1 }])).toBeDefined();
    expect(storage.current).toHaveProperty('uuid');
    expect(storage.current.uuid).toBe('a123');
    expect(storage.current.data).toEqual([{ a: 1 }]);

    const prev = storage.write([{ a: 2 }]);
    expect(prev).toBeDefined();
    //expect(prev.data).toEqual([{ a: 2 }]);
});

test('you can delete existring records', () => {
    const proxy = u.storage.bind({
        localStorage: {
            'rewrite-previous': 'a123',
            'rewrite-a123': JSON.stringify([{ text: 'test' }]),
            'rewrite-articles': JSON.stringify([
                {
                    name: 'test',
                    uuid: 'a123',
                    created: 123,
                    modified: 321,
                },
            ]),
        },
    });
    const storage = new Storage(proxy);

    expect(storage.list()).toHaveLength(1);
    expect(storage.delete('a123')).toBe(true);
    expect(storage.list()).toHaveLength(0);
    //   console.log(proxy().data());
});
