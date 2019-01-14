function childrenToVersionArray(children, char = ">") {
  // create a versions array from DOM collection

  // First cast to collection of the value and visiblity
  const data = [...children].map(row => {
    const hidden = row.classList.contains("inactive");
    const text = `${row.innerText}`.trim();

    return { text, hidden };
  });

  // Second, cast as plaintext array (versions)
  const versions = data.map(o => {
    const pre = o.hidden ? char : "";
    const text = o.text;

    return `${pre}${text}`;
  });

  return versions;
}

export default childrenToVersionArray;
