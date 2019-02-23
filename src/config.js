const re = {
    lineEnd: /(^\w|[.?!;]\s+\w)/g, // alpha. beta? charlie! delta;
    newLine: /^-{3,}/, // the magic sequence to add <br/> via editor
    commentChars: /^(\s+)?[>?!/]+(\s+)?/, // so far ... the prefix comment tokens
    passiveKeys: /^(arrow|shift|control|alt|tab)/i, // keys that dont alter the sentence
};
let options = {
    flag: 'inactive',
    re: /^(\s+)?[>?!/]+(\s+)?/,
    tag: 'p',
    br: '<br/>',
    markdown: true,
};
const timer = {
    // after: 2500, // the last event to fire, this is used to persist
    default: 100, // the normal event delay in miliseconds
    delay: 0, // dynamic var update depending on event type
};
export default {
    re,
    timer,
    options,
};
