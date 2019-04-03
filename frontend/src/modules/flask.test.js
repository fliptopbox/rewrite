const url = 'http://localhost:5000/api/v1.0';
const tester = 'api-testing-user';
const options = () => ({
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
});

function deleteTester() {
    const data = options();
    data.method = 'DELETE';
    return fetch(url + '/user/' + tester, data).then(r => r.json());
}

function createTester() {
    let data;
    const email = `${tester}@${tester}.com`;
    data = options();
    data.method = 'POST';
    data.body = JSON.stringify({
        username: tester,
        email: email,
    });

    return fetch(url + '/user', data).then(r => r.json());
}

test('the API has a user collection', async () => {
    expect.assertions(2);

    const data = await fetch(url + '/users');
    expect(data.status).toBe(201);

    const json = await fetch(url + '/users').then(r => r.json());
    expect(Object.keys(json.users)).toBeTruthy();
});

test('the API can create a test user', async () => {
    expect.assertions(2);
    await deleteTester();

    const data = options();
    data.method = 'POST';
    data.body = JSON.stringify({
        username: tester,
        email: `${tester}@${tester}.com`,
    });

    const json = await fetch(url + '/user', data).then(r => r.json());
    expect(Object.keys(json)).toBeTruthy();
    expect(json).toEqual({ 'user created': true });
});

test('the API can delete a test user', async () => {
    expect.assertions(2);

    const data = options();
    data.method = 'DELETE';

    const json = await fetch(url + '/user/' + tester, data).then(r => r.json());
    expect(Object.keys(json)).toBeTruthy();
    expect(json).toEqual({ 'user deleted': tester });
});

test('Creating a user also creates default settings', async () => {
    expect.assertions(4);
    await deleteTester();
    await createTester();

    let data;
    let json;

    data = options();
    data.method = 'GET';
    json = await fetch(url + '/user/' + tester, data).then(r => r.json());
    expect(json).toHaveProperty('settings');
    expect(json.settings).toHaveProperty('current');
    expect(json.settings).toHaveProperty('modifiers');
    expect(json.settings).toHaveProperty('values');
});

test('A user can update their email address', async () => {
    expect.assertions(1);
    await deleteTester();
    await createTester();

    let data;
    let json;

    const newemail = `${tester}2@${tester}.com`;

    data = options();
    data.method = 'PUT';
    data.body = JSON.stringify({
        email: newemail,
    });
    json = await fetch(url + '/user/' + tester, data).then(r => r.json());
    expect(json).toEqual({ 'user updated': `${tester}2@${tester}.com` });
});

test('A user can persist a new article', async () => {
    expect.assertions(1);
    await deleteTester();
    await createTester();

    let data;
    let json;

    data = options();
    data.method = 'POST';
    data.body = JSON.stringify({
        data: [{ text: 'A line of text' }],
        meta: { name: 'new article' },
    });
    json = await fetch(url + '/article/' + tester, data).then(r => r.json());
    expect(json).toEqual({ 'article created': true });
});
