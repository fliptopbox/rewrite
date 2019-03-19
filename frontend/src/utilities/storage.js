import defer from './defer';

let origin = document.location.origin;
origin = /localhost/i.test(origin) ? origin.replace(/[0-9]+$/, '5000') : origin;
console.log('API origin', origin);

const API = {
    settings: `${origin}/api/v1.0/settings/`,
    article: `${origin}/api/v1.0/article/`,
    user: `${origin}/api/v1.0/user/`,
};

function storage(sufix = null) {
    let delay = 250;
    const ns = ['rewrite', sufix].filter(val => val).join('-');
    const apiPushDelay = 10 * 1000; // 10 seconds
    const { onLine } = window.navigator;

    // this looks strange. leave it! it's for JEST testing.
    const localStorage = this.localStorage || window.localStorage;

    return {
        data: () => {
            return localStorage;
        },

        delete: () => {
            delete localStorage[ns];
        },

        pull: (guid, fn) => {
            if (!onLine) fn(null);

            console.log('pull from api %s (%s)', guid, API.user);

            fetch(`${API.user}${guid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(r => r.json())
                .then(json => {
                    const status = 200;
                    const settings = { ...json.settings };
                    let previous =
                        settings.previous || settings.current || null;

                    // articles is a contrived index of metadata
                    let articles = Object.keys(json)
                        .filter(k => /^[a-z0-9]{16}/.test(k))
                        .map(r => {
                            return json[r].meta;
                        });

                    // deleting "settings" leaves the raw article rows
                    delete json.settings;

                    const data = {
                        ...json,
                        settings,
                        articles,
                        previous,
                    };
                    fn({
                        status,
                        data,
                    });
                });
        },
        getUser: username => {
            if (!onLine) {
                console.log('not online');
                return;
            }
            return fetch(`${API.user}${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(r => r.json());
        },

        updateArticle: (username, article_id, payload) => {
            if (!onLine) {
                console.log('not online');
                return;
            }
            fetch(`${API.article}${username}/${article_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })
                .then(r => r.json())
                .then(d => console.log(d, username, article_id));
        },
        updateSettings: body => {
            const username = body.guid;
            if (!username) {
                console.warn('Cant push settings. No username', body);
                return;
            }
            fetch(`${API.settings}${username}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            })
                .then(r => r.json())
                .then(d => console.log(d));
        },
        update: article_object => {
            const { uuid } = article_object;
            fetch(`${API.article}${uuid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(article_object),
            })
                .then(r => r.json())
                .then(d => console.log(d));
        },

        push: (guid = null, priority = 0) => {
            if (!onLine) {
                console.log('not online');
                return;
            }
            if (!guid) {
                console.log('no guid');
                return;
            }

            console.log('push to api %s', guid, API.settings, API.article);
            return defer(
                'push',
                function() {
                    let data = {};

                    Object.keys(localStorage)
                        .filter(k => /^rewrite/i.test(k))
                        .map(name => {
                            const key = name.replace(/^([^-]+-+)/, '');
                            data[key] = localStorage[name];
                            return name;
                        });

                    // settings is a seperate API call
                    // it needs to include previous (aka current)
                    // and ensure the key names are kosher

                    let settings = {};
                    data.settings = JSON.parse(data.settings);
                    Object.keys(data.settings)
                        .filter(k => /^([a-z]+)$/i.test(k))
                        .forEach(k => {
                            if (/^settings/i.test(k)) return;
                            settings[k] = data.settings[k];
                        });

                    fetch(`${API.settings}${guid}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(settings),
                    })
                        .then(r => r.json())
                        .then(d => console.log(d));

                    // articles have a new schema it is a
                    // catentation of data and article meta data
                    // the API will insert or update articles

                    console.log(data.articles);
                    JSON.parse(data.articles).forEach(r => {
                        const key = r.guid || r.uuid;
                        const article = {
                            meta: {
                                uuid: key,
                                username: guid,
                                created: r.created,
                                modified: r.modified || r.opened,
                                name: r.name,
                                wordtarget: r.wordtarget,
                            },
                            data: JSON.parse(data[key]),
                        };

                        fetch(`${API['article']}${guid}/${key}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(article),
                        })
                            .then(r => r.json())
                            .then(d => console.log(d));
                    });
                },
                priority || apiPushDelay
            );
        },

        backup: (label = null) => {
            /*
             * a discreet save, and drasric change dectector
             * if too much change happerns, a new record is
             * created as a precaution
             * */

            const id = `${ns}-backup`;
            const defaults = { averages: [], datas: [] };
            const threshold = 100 - 22; // % of difference
            const name = label || new Date().valueOf();

            return defer(
                id,
                function() {
                    const current = localStorage[ns] || null;
                    const row = { tag: name, data: current };

                    let index = 0;
                    let backups = localStorage[id] || null;
                    let percent = [99];
                    let array = [row];

                    backups = backups ? JSON.parse(backups) : defaults;

                    if (backups.datas.length) {
                        index = backups.datas.length - 1;
                        const A = JSON.stringify(row);
                        const B = JSON.stringify(backups.datas.slice(-1));
                        const min = Math.min(A.length, B.length);
                        const max = Math.max(A.length, B.length);
                        const ratio = parseInt((min / max) * 100, 10);

                        const total = backups.averages.reduce(
                            (a, c) => a + Number(c || 0)
                        );
                        const mean = total / backups.averages.length;
                        const insertRow = (ratio / mean) * 100 < threshold;

                        // console.log(
                        //     'INSERT',
                        //     insertRow,
                        //     (ratio / mean) * 100,
                        //     threshold
                        // );

                        // if a dramatic difference is detected then add another row
                        if (insertRow) {
                            console.warn(
                                'Insert backup. [%s] (%s)',
                                insertRow,
                                threshold
                            );
                            backups.datas.push(row);
                        } else {
                            // console.log('update', index);
                            backups.averages.push(ratio);
                            backups.datas[index] = row;
                        }

                        percent = backups.averages.slice(-25);
                        array = backups.datas;
                    }

                    backups = {
                        averages: percent,
                        datas: array,
                    };

                    localStorage[id] = JSON.stringify(backups);
                },
                1000
            );
        },

        read: fn => {
            const data = localStorage[ns] || null;
            const isJson = data && /^[[{"]/.test(data);
            const object = isJson ? JSON.parse(data) : data;
            return fn && fn.construcor === Function ? fn(object) : object;
        },

        write: (obj, async = false) => {
            const fn = () => (localStorage[ns] = JSON.stringify(obj));
            return async ? defer(ns, fn, delay, true) : fn();
        },
    };
}

export default storage;
