import sbd from 'sbd';
import jsonSafeParse from './jsonParseSafe';

function selectedValueArray(selected) {
    if (!selected) return;
    let { innerText, dataset } = selected;
    const versions = dataset.versions;

    // if there are versions and the innerText is "empty"
    // then the line was deactivate by the sentence editor
    selected.classList.remove('empty');
    if (!innerText.replace(/^\(empty\)$/, '')) {
        selected.classList.add('empty');
        innerText = '(empty)';
    }

    innerText = innerText ? sbd.sentences(innerText) : [''];
    const array = dataset.versions ? jsonSafeParse(versions) : innerText;

    return array;
}

export default selectedValueArray;
