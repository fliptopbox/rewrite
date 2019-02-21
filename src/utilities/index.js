import childrenToVersionArray from './childrenToVersionArray';
import collectionToHtml from './collectionToHtml';
import deepEqual from 'deep-is';
import defer from './defer';
import download from './download';
import focusOn from './focusOn';
import htmlToCollection from './htmlToCollection';
import inflate from './inflate';
import message from './message';
import readTextFile from './readTextFile';
import selectedValueArray from './selectedValueArray';
import toggleStringCase from './toggleStringCase';
import tts from './tts';
import unwrap from '../utilities/unwrap';
import uuid from './uuid';
import wordcount from './wordcount';
import backupRestore from './backupRestore';
import points from './points';
import elapsed from './elapsed';

export default {
    alert,
    confirm,
    prompt,

    backupRestore,
    childrenToVersionArray,
    collectionToHtml,
    deepEqual,
    defer,
    elapsed,
    download,
    focusOn,
    htmlToCollection,
    inflate,
    message,
    points,
    readTextFile,
    selectedValueArray,
    storage,
    time,
    toggleStringCase,
    tts,
    unwrap,
    uuid,
    wordcount,
};

function time() {
    return new Date().toString().replace(/.* (\d+:\d+:\d+) .*/g, '$1');
}

function storage(sufix = null) {
    let delay = 250;
    const ns = ['rewrite', sufix].filter(val => val).join('-');

    // this looks strange. leave it! it's for JEST testing.
    const localStorage = this.localStorage || window.localStorage;

    return {
        data: () => {
            return localStorage;
        },

        delete: () => {
            delete localStorage[ns];
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

                        console.log(
                            'INSERT',
                            insertRow,
                            (ratio / mean) * 100,
                            threshold
                        );

                        // if a dramatic difference is detected then add another row
                        // asfasf asfasfdasfd asfasfasf asfasfasf asdfasfasf
                        if (insertRow) {
                            console.log('insert');
                            backups.datas.push(row);
                        } else {
                            console.log('update', index);
                            backups.averages.push(ratio);
                            backups.datas[index] = row;
                        }

                        percent = backups.averages.slice(-25);
                        array = backups.datas;
                    }

                    console.log('BACKUP [%s]', id);
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

// const { prompt, confirm, alert } = windowdd
function prompt(s, value) {
    return window.prompt(s, value);
}

function confirm(s) {
    return window.confirm(s);
}

function alert(s) {
    return window.alert(s);
}
