import React from 'react';
import ToggleToInput from './ToggleToInput.js';
import elapsed from '../../utilities/elapsed';

function FileRow({ object, callbacks }) {
    const { guid, uuid, name, wordtarget, opened } = object;
    const {
        store,
        getArticleByGuid,
        updateCurrent,
        handleDelete,
        handleWordTarget,
        downloadText,
        downloadJson,
    } = callbacks;

    const target = wordtarget ? `${wordtarget} words` : `add`;
    const article_id = guid || uuid;

    return (
        <div
            className="inner"
            onClick={() => {
                getArticleByGuid(article_id);
                updateCurrent(article_id);
            }}>
            <span className="file-name" data-guid={article_id}>
                <ToggleToInput name={name} guid={article_id} store={store} />
            </span>
            <ul className="file-meta">
                <li>
                    <a
                        href="#delete"
                        onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDelete(article_id);
                        }}>
                        del
                    </a>
                </li>
                <li
                    className="file-words"
                    onClick={e => handleWordTarget(e, wordtarget, article_id)}>
                    Target: {target}
                </li>

                <li className="file-modified">{elapsed(opened)}</li>
                <li className="file-exports">
                    <a href="#txt" onClick={downloadText}>
                        txt
                    </a>
                    <a href="#json" onClick={downloadJson}>
                        json
                    </a>
                </li>
            </ul>
        </div>
    );
}
export default FileRow;
