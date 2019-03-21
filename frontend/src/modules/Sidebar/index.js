import React from 'react';
import Parse from '../../utilities/Parse';
import u from '../../utilities/';
import FileRow from './FileRow';
import Settings from './Settings';
import divider from '../divider';

const { read } = u.storage('settings');
const html = document.querySelector('html');

// a keypress toggle. 1st press = on, 2nd press = off
// different platforms have strange quirks with holding down keys + clicking
window.addEventListener('keydown', e => {
    let method, className;
    if (e.altKey) {
        className = 'show-alternative';
        method = html.classList.contains(className) ? 'remove' : 'add';
        html.classList[method](className);
    }
});

class Sidebar extends React.Component {
    constructor(props) {
        super();
        this.state = {
            guid: null,
            current: null,
            splitwidth: 50,
            articles: [],
        };

        // bind the onAfter event to persit the data
        props.article.on('after', null, this.saveToDisk.bind(this));
        props.sentences.on('after', null, this.saveToDisk.bind(this));
    }
    saveToDisk() {
        u.defer(
            'savearticle',
            () => {
                const { article } = this.props;
                const { current, guid, articles } = this.state;
                const fs = u.storage(current);

                const children = article.texteditor.children;
                const data = new Parse(children).toCollection();

                const meta = articles.find(r => r.uuid === current);
                const payload = { data, meta };

                console.log(
                    'persit article',
                    this.state.guid,
                    this.state.current
                );
                console.log('payload', payload);

                //store.write(data);
                fs.write(payload);
                fs.updateArticle(guid, current, payload);
            },
            1500
        );
    }
    componentDidMount() {
        // update with persisted data
        const articles = this.getUpdatedArticles();
        const { guid = null, current = null, values = null } =
            read() || this.state;
        const { splitwidth = 50 } = values || {};
        const state = { articles, guid, current, splitwidth };
        this.setState(state);

        // instanate the divider
        this.mouse = this.props.mouse;
        this.divider = divider(splitwidth, this.mouse);
        this.divider.add('wordcount');
        this.divider.onResize(this.saveDividerWidth);

        // bind the wordcounter events
        this.props.article.on('wordcounter', null, d =>
            this.updateWordCount(d)
        );
        this.props.sentences.on('wordcounter', null, () =>
            this.props.article.wordcounter()
        );
        this.props.store.setSyncProfile(guid);

        this.registerMouseEvent();
    }

    saveDividerWidth = value => {
        u.defer(
            'splitwidth',
            () => {
                console.log('save divider width', value);
                this.setState({ splitwidth: value });
            },
            750
        );
    };

    syncWithServer = username => {
        if (!username) {
            console.warn('Require sync profile id');
            return;
        }

        // sync with server
        // 1. does this user exist?
        // 2. get the remote articles
        // 3. compare the modified timestamps
        // 4. collect the articles that are newer thatn localStorage
        // 5. push the new or more recent records to the server
        //

        const fs = u.storage('articles');
        const localtimestamps = {};
        let localarticles = fs.read();

        localarticles.forEach(r => {
            console.log('local timestamps', r.uuid);
            localtimestamps[r.uuid] = r.modified || r.opened;
        });

        fs.getUser(username).then(json => {
            let meta, diff, prev, next;
            console.log(111111, json);
            for (let row in json) {
                if (/settings$/.test(row)) continue;
                meta = json[row].meta;
                meta.uuid = row;

                if (!localtimestamps[row]) {
                    console.log('Create local article [%s]', row);
                    u.storage(row).write(json[row]);
                    localarticles = localarticles.filter(r => r.uuid !== row);
                    localarticles.push(meta);
                    continue;
                }
                // there is a local version
                // compare timestamp and keep newset
                prev = u.storage(row).read();
                next = json[row];
                diff = prev.meta.modified - next.meta.modified;

                if (diff > 10 * 1000) {
                    console.log('Replace remote data', row, username);
                    fs.updateArticle(username, row, prev);
                    continue;
                }

                u.storage(row).write(next);
                localarticles = localarticles.filter(r => r.uuid !== row);
                console.log(222222, localarticles);
                localarticles.push(next.meta);
            }
            fs.write(localarticles);
            u.storage('settings').write(json.settings);
            this.setState({ articles: [...localarticles], guid: username });
        });

        // const { purge, restore } = u.backupRestore;
        // const fn = json => {
        //     const { status, data } = json;
        //     if (status !== 200) {
        //         console.error('Nothing to restore', json);
        //         return;
        //     }

        //     console.warn('Restoring remote data');

        //     purge('rewrite');
        //     restore('rewrite', data);
        //     let { articles, settings } = data;
        //     const current = settings.current || null;
        //     const { splitwidth = 50 } = settings.values || {};

        //     let state = { current, splitwidth, articles, guid };

        //     this.setState(state);
        //     this.getArticleByGuid(current);
        //     this.props.store.setSyncProfile(guid);
        // };

        // return u.storage().pull(guid, fn);
    };

    getUpdatedArticles() {
        const { store } = this.props;
        const articles = store.list();
        return articles;
    }

    registerMouseEvent() {
        const body = document.querySelector('body');
        const sidebar = document.querySelector('#sidebar');
        const zone = [5, sidebar.offsetWidth + 50]; // mouse trigger region
        let showsidebar = body.classList.contains('show-sidebar');

        this.props.mouse(null, 'move', e => {
            const { pageX } = e;
            zone[1] = sidebar.offsetWidth + 50;
            showsidebar = body.classList.contains('show-sidebar');

            if (!showsidebar && pageX > zone[0]) {
                return;
            }

            if (pageX > zone[1]) {
                body.classList.add('sidebar-close');
                u.defer(
                    'animate',
                    () => {
                        body.classList.remove('sidebar-close');
                        body.classList.remove('show-sidebar');
                        html.classList.remove('show-alternative');
                    },
                    250
                );
            }

            // if (pageX < zone[0] || (showsidebar && pageX < zone[1])) {
            if (pageX < zone[0]) {
                // refresh the articles list
                this.setState({ articles: this.getUpdatedArticles() });
                body.classList.add('show-sidebar');
                u.defer(
                    'sidebar',
                    () =>
                        pageX > zone[1]
                            ? body.classList.remove('show-sidebar')
                            : null,
                    500
                );
            }
        });
    }

    updateCurrent = current => {
        let settings = this.state;
        settings.current = current;

        this.setState(settings);

        const body = document.querySelector('body');
        body.classList.add('sidebar-close');

        u.defer(
            'animate',
            () => {
                body.classList.remove('sidebar-close');
                body.classList.remove('show-sidebar');
            },
            350
        );
    };

    getArticleByGuid = guid => {
        const { store, article } = this.props;
        const fileObj = store.read(guid);
        const { data } = fileObj;
        article.setWordTarget(fileObj.wordtarget);
        return article.reset(data);
    };

    updateWordCount(words) {
        this.divider.update('wordcount', words);
    }
    handleWordTarget = (e, wordtarget = 0, article_id) => {
        e.preventDefault();
        e.stopPropagation();
        const el = e.target;
        const data = u.storage(article_id);
        const article = data.read();
        const value = u.prompt(
            'Enter a word count target for this document.',
            wordtarget
        );

        article.meta.wordtarget = Number(value) || 0;
        data.write(article);
        data.update(article);
        el.innerHTML = `Target ${value || ': add'}`;
        console.log('set word targetr', this.state.current, article_id);
        if (this.state.current !== article_id) return;
        // update the wordcounter
        this.props.article.setWordTarget(value);
        this.props.article.wordcounter();
    };
    getArticles() {
        const articles = this.getUpdatedArticles();
        let current = this.state.current || articles[0].uuid;

        const { store } = this.props;
        let callbacks = {
            getArticleByGuid: this.getArticleByGuid,
            updateCurrent: this.updateCurrent,
            handleDelete: this.handleDelete,
            handleWordTarget: this.handleWordTarget,
            store,
            downloadText: this.download('text'),
            downloadJson: this.download('json'),
        };

        let files = null;

        if (articles && articles.length) {
            files = articles.map((obj, n) => {
                const key = obj.guid || obj.uuid;
                const selected = key === current ? 'selected' : '';

                return (
                    <li key={key} className={selected}>
                        <FileRow object={obj} callbacks={callbacks} />
                    </li>
                );
            });
        }

        return (
            <div id="files">
                <hr />
                <ul>{files}</ul>
            </div>
        );
    }

    handleDelete = ariticle_id => {
        const { store } = this.props;
        const msg = 'You are about to delete this file.\nAre you sure?';
        if (!window.confirm(msg)) return false;

        store.delete(ariticle_id); // deletes and update articles list
        const articles = store.list();

        // if the deleted article is the current one, reload with
        // the first available article in the article list
        if (ariticle_id === this.state.current && articles.length) {
            ariticle_id = articles[0].uuid;
            console.log('Delete current. re-initalize editors', ariticle_id);
            this.getArticleByGuid(ariticle_id);
        }

        ariticle_id = articles.length ? ariticle_id : null;
        this.setState({ articles, current: ariticle_id });
    };

    makeEditable = (e, name, guid) => {
        e.stopPropagation();
        const { rename } = this.props.store;
        console.log(123, name, guid);

        return (
            <input
                type="text"
                defaultValue={name}
                onBlur={e => rename(guid, e.target.value)}
                onKeyPress={e => {
                    e.stopPropagation();
                    if (/enter/i.test(e.key)) {
                        e.target.blur();
                        rename(guid, e.target.value);
                    }
                    return true;
                }}
            />
        );
    };

    handleImport = e => {
        // import the document and re-set the editor and current id
        // save to localStorage, update articles list and try to sync to server.
        const { store, article } = this.props;
        const that = this;
        store.open(e, function(name, text) {
            const p = new Parse(text);
            const current = store.create(null, name, p.toCollection());
            article.reset(current.data);
            that.setState({ articles: store.list(), current: current.current });
        });
    };

    handleDataRestore = e => {
        const { restore } = u.backupRestore;
        const { readTextFile } = u;
        const ns = 'rewrite';

        return readTextFile(e, (name, plaintext) => {
            const data = JSON.parse(plaintext);
            const keys = Object.keys(data);
            const valid = keys.filter(k =>
                /(articles|previous|settings)$/i.test(k)
            );

            console.log(valid);
            // restore if there is data integrity
            if (!valid.length === 3) {
                console.error('Restore failed integrity check', data);
                return;
            }

            const contd = u.confirm(
                'You are about to overwrite existing data.\nAre you sure?'
            );
            if (!contd) return;

            Object.keys(localStorage).forEach(k =>
                k.indexOf() + 1 ? delete localStorage[k] : null
            );
            return restore(ns, data);
        });
    };

    download = (mime = 'text') => {
        const method =
            {
                text: 'toText',
                markdown: 'toMarkdown',
                json: 'toCollection',
            }[mime] || 'text';
        const { state } = this;

        return e => {
            e.preventDefault();
            e.stopPropagation();

            const saveAs = e.altKey ? true : false;
            const { current } = state;
            const fs = u.storage(current);

            let { data, meta } = fs.read(current);
            let { name, uuid } = meta;
            const date = new Date()
                .toISOString()
                .replace(/:\d+.\d+.$/, '')
                .replace('T', ' ');

            // pressing a ket modifier presents the save-as prompt
            const filename = saveAs
                ? u.prompt(`Enter filename`, `${name}-${date}`)
                : name;
            if (!name || !name.trim()) {
                console.log('No file name', current, uuid, name, data);
                return;
            }

            const p = new Parse(data);
            const object = {
                name: filename,
                id: uuid,
                data: p[method](),
                type: mime,
                appendId: false,
            };
            return u.download(object);
        };
    };

    render() {
        const articleList = this.getArticles();
        return (
            <div>
                <ul className="actions">
                    <li>
                        <div
                            className="inner"
                            onClick={() => {
                                this.props.store.create(null, 'Untitled', [{}]);
                                this.props.article.init([{}]);
                                return;
                            }}>
                            New
                        </div>
                    </li>
                    <li>
                        <label htmlFor="uploadInput" className="inner">
                            <span>Open</span>
                            <input
                                id="uploadInput"
                                className="hidden"
                                onChange={this.handleImport}
                                type="file"
                                accept="text/*"
                            />
                        </label>
                    </li>
                    <li>
                        <div className="inner" onClick={this.download('text')}>
                            <span>
                                Save <i className="on-alternative-inline">As</i>
                            </span>
                        </div>
                    </li>
                    <div className="on-alternative">
                        <li>
                            <div
                                className="inner"
                                onClick={() => {
                                    const { download, backupRestore } = u;
                                    const { backup } = backupRestore;

                                    const data = backup('rewrite');
                                    const meta = {
                                        name: 'rewriting-backup',
                                        id: new Date().toISOString(),
                                        data,
                                    };
                                    return download(meta);
                                }}>
                                <span>Backup</span>
                            </div>
                        </li>
                        <li>
                            <label htmlFor="restoreData" className="inner">
                                <span>Restore</span>
                                <input
                                    id="restoreData"
                                    className="hidden"
                                    onChange={this.handleDataRestore}
                                    type="file"
                                    accept="text/json"
                                />
                            </label>
                        </li>
                        <li>
                            <div
                                className="inner"
                                onClick={() => {
                                    const guid = u.prompt(
                                        'Enter your sync id:'
                                    );
                                    return this.syncWithServer(guid);
                                }}>
                                <span>Sync Profile</span>
                                <em>{this.state.guid || 'Not syncing'}</em>
                            </div>
                        </li>
                    </div>
                </ul>
                {articleList}
                <Settings
                    article={this.props.article}
                    guid={this.state.guid}
                    current={this.state.current}
                    splitwidth={this.state.splitwidth}
                />
            </div>
        );
    }
}

export default Sidebar;
