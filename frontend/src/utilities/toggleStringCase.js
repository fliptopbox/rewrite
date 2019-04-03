function toggleStringCase(string) {
    const lowercase = string.toLowerCase();
    const uppcercase = string.toUpperCase();
    const lineEnd = /(^\w|[.?!;]\s+\w)/g;

    string =
        string !== uppcercase
            ? uppcercase
            : lowercase.replace(lineEnd, (a, b) => a.toUpperCase());

    return string;
}

export default toggleStringCase;
