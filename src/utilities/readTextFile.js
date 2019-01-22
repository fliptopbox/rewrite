/*
<label for="uploadInput">
    <span>upload</span>
    <input id="uploadInput" type="file" style="display:none;" accept="text/*">
</label>
 */

function readTextFile(e, callback) {
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

export default readTextFile;
