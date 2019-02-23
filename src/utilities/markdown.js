const h = /(^[#]+)\s(\w.*)/;
const em = /((^_(.*)_$)|(^\*(.*)\*$))/;
const strong = /((^_{2}(.*)_{2}$)|(^\*{2}(.*)\*{2}$))/;
const hr = /^[-]{3,}$/;

function markdown(string, array = []) {
    let finished = null;

    // headings ... H1-6
    if (h.test(string)) {
        array.push(`h${Math.min(6, string.match(h)[1].length)}`);
        string = string.replace(h, '$2');
        finished = true;
    }

    // horizontal rule HR
    if (hr.test(string)) {
        array.push('hr');
        string = '';
        finished = true;
    }

    // recursive evaulations ... em, strong
    if (!finished && strong.test(string)) {
        array.push('strong');
        string = string.replace(strong, '$3$5'); //?
        return markdown(string, array); //?
    }

    if (!finished && em.test(string)) {
        array.push('em');
        string = string.replace(em, '$3$5'); //?
        return markdown(string, array); //?
    }

    // if there are matched append the sanitized string
    finished = [...array];
    if (finished.length) finished.push(string);

    // reset the recursive array
    array = null;

    return finished;
}
/** quokka inline */
markdown('# heading'); //?
markdown('------'); //?
markdown('*em*'); //?
markdown('_em_'); //?
markdown('**strong**'); //?
markdown('_*nothing*_'); //?
markdown('__*strongem*__'); //?
markdown('__strong__'); //?
markdown('_**emstrong**_'); //?
markdown('**_emstrong_**'); //?
markdown('*__strongem__*'); //?

/** quokka inline */

export default markdown;
