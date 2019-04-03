/*
<label for="uploadInput">
    <span>upload</span>
    <input id="uploadInput" type="file" style="display:none;" accept="text/*">
</label>
*/
const readTextFile = e => {
    const inputFile = e.currentTarget.files;
    const file = inputFile[0];
    const filename = file.name;

    const temporaryFileReader = new FileReader();

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

export default readTextFile;
