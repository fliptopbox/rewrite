function interval(then, now = null) {
    const parts = then.toString().split(/[\s:]/g); //?

    then = then.valueOf();
    now = now || new Date().valueOf();
    const diff = now - then;

    //   if (!diff) {
    //     return null;
    //   }

    // local time and date
    const [weekday, month, day, year, hour, minute, second, offset, tz] = parts;

    // just the current time
    const time = `${hour}:${minute}`;

    const intervals = [
        { name: 'milisecond', value: 1 },
        { name: 'second', value: 1000 },
        { name: 'minute', value: 60 },
        { name: 'hour', value: 60 },
        { name: 'day', value: 24 },
        { name: 'week', value: 7 },
        { name: 'month', value: 52 / 12 },
        { name: 'year', value: 12 },
    ];

    // append accumulated time diff to interval Object
    intervals.reduce((acc, cur) => {
        cur.diff = acc / cur.value;
        return acc / cur.value; //?
    }, diff);

    // remove falsey values
    const candidates = intervals.filter(v => v.diff >= 1); //?
    const candidate = intervals[candidates.length - 1]; //?

    return {
        ...candidate,
        time,
        weekday,
        month,
        day: Number(day),
        year: Number(year),
        hour: Number(hour),
        minute: Number(minute),
        second: Number(second),
        offset,
        tz,
    };
}

function isDate(value) {
    return value && value !== 'Invalid Date' && !isNaN(value) ? true : false;
}

function elapsed(then, now = null) {
    // integrity check dates, and if "then" date is in the future
    if (!isDate(then) || !isDate(now) || then > now) return null;

    //   quick diff ...
    if (now.valueOf() - then.valueOf() < 1000 * 30) {
        return `Now`;
    }

    const e = interval(then, now);

    let result;
    switch (e.name) {
        case 'milisecond':
            result = `Now`;
            break;
        case 'second':
            if (e.diff < 30) {
                result = `Now`;
                break;
            }
            result = `${parseInt(e.diff)} seconds ago`;
            break;
        case 'minute':
            if (e.diff < 2) {
                result = `A minute ago`;
                break;
            }
            result = `${parseInt(e.diff)} minutes ago`;
            break;

        case 'hour':
            if (e.diff < 2) {
                result = 'An hour ago';
                break;
            }

            if (e.diff < 12) {
                result = `${e.diff} hours ago`;
                break;
            }

            result = `At ${e.time}`;
            break;

        case 'day':
            if (e.diff < 2) {
                result = `Yesterday at ${e.time}`;
                break;
            }
            result = `${e.weekday} at ${e.time}`;
            break;

        case 'week':
            if (e.diff < 2) {
                result = `Last ${e.weekday} at ${e.time}`;
                break;
            }
            result = `${e.weekday} ${e.day} ${e.month} at ${e.time}`;
            break;

        case 'month':
            if (Number(e.year) === now.getFullYear()) {
                result = `${e.weekday} ${e.day} ${e.month} at ${e.time}`;
                break;
            }

        // eslint-disable-next-line
        default:
            result = `${e.day} ${e.month} ${e.year} ${e.time}`;
            break;
    }
    return result;
}

/** quokka inline * /

const then = new Date(1971, 4, 31, 23, 59, 58); //?
const now = new Date(1971, 5, 1, 1, 1, 1); //?
elapsed(then, now); //?

/** */

export default elapsed;
