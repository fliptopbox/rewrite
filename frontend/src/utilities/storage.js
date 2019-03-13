import defer from './defer';

function storage(sufix = null) {
    let delay = 250;
    const ns = ['rewrite', sufix].filter(val => val).join('-');
    const apiServerUrl = 'https://fliptopbox.com/cgi-bin/getuser.py';
    const apiPushDelay = 60 * 1000; // 1minute

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
            const formData = new FormData();
            formData.append('guid', guid);

            fetch(`${apiServerUrl}`, {
                method: 'POST',
                body: formData,
            })
                .then(rx => rx.json())
                .then(json => fn(json));
        },

        push: (guid = null, priority = 0) => {
            if (!guid) return;
            return defer(
                'push',
                function() {
                    let data = {};

                    Object.keys(localStorage).map(name => {
                        const key = name.replace(/^([^-]+-+)/, '');
                        data[key] = localStorage[name];
                        return name;
                    });

                    const formData = new FormData();
                    formData.append('guid', guid);
                    formData.append('data', JSON.stringify(data));

                    fetch(`${apiServerUrl}`, {
                        method: 'POST',
                        body: formData,
                    })
                        .then(r => r.json())
                        .then(json => console.log('relpy', json));
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
