/*
<label for="uploadInput">
    <span>upload</span>
    <input id="uploadInput" type="file" style="display:none;" accept="text/*">
</label>
*/

function v1(e, callback) {
    const files = e.currentTarget.files;
    const reader = new FileReader();
    const file = files[0];
    const filename = file.name;

    reader.onload = e => {
        const { result } = e.target;
        return callback(filename, result);
    };
    reader.readAsText(file);
}

const v2 = e => {
    const temporaryFileReader = new FileReader();
    const inputFile = e.currentTarget.files;
    const file = inputFile[0];
    const filename = file.name;
    console.log(inputFile);

    return new Promise((resolve, reject) => {
        temporaryFileReader.onerror = () => {
            temporaryFileReader.abort();
            reject(new DOMException('Problem parsing input file.'));
        };

        temporaryFileReader.onload = e => {
            const result = {
                name: filename,
                result: e.target.result,
            };
            resolve(result);
        };
        temporaryFileReader.readAsText(file);
    });
};

export default v2; //readTextFile;zR
