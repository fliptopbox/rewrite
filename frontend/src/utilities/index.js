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
import jsonParseSafe from './jsonParseSafe';
import storage from './storage';

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
    jsonParseSafe,
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
