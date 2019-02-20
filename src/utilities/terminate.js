const re_punctuation = /(\.|:|!|\?|"|\))$/g;

function terminate(text, autoTerminate = false) {
    // return a closed sentnece.
    text = text && text.trim();

    if (!text) return;

    var is_closed = re_punctuation.test(text);
    var sufix = autoTerminate && !is_closed ? '.' : '';

    return `${text}${sufix}`;
}

export default terminate;
