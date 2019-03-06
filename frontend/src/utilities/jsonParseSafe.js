// jsonParseSafe
export default function(string, alt = '') {
    let result;
    const apost = '’'; // Try to coeherse JSON errors
    try {
        string = string.replace(/'/g, apost);
        result = JSON.parse(string);
    } catch (e) {
        console.error('JSON parse Error!\nUsing alternative:[%s]', alt);
        console.log(e);
        result = alt;
    }
    return result;
}
