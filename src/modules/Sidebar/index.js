import React from 'react';
import Parse from '../../utilities/Parse';
import u from '../../utilities/';
const { read, write } = u.storage('settings');

const html = document.querySelector("html");

window.addEventListener("keyup", e => {
    if(!e.altKey) html.classList.remove("show-alternative");
});

window.addEventListener("keydown", e => {
    if(e.altKey) html.classList.add("show-alternative");
});

class ToggleToInput extends React.Component {
    constructor(props) {
        super();
        this.state = {
            edit: false,
            name: props.name,
            original: props.name,
            guid: props.guid,
        };
    }
    rename = (reset = false) => {
        const { guid, name, original } = this.state;
        let value = original;

        if (!reset && name && name.trim() && name !== original) {
            value = name.trim();
            this.props.store.rename(guid, value);
        }

        this.setState({ edit: false, name: value, original: value });
    };

    toggleEditAndFocus = e => {
        e.stopPropagation();
        this.setState({ edit: true });
        const { guid } = this.state;
        setTimeout(() => document.querySelector(`#${guid}`).focus(), 150);
    };

    render() {
        const { name, edit, guid } = this.state;
        return !edit ? (
            <span className="file-toggle-input">
                {name}
                <a href="#edit"onClick={this.toggleEditAndFocus}>edit</a>
            </span>
        ) : (
            <input
                id={guid}
                type="text"
                tabIndex="0"
                value={name}
                onBlur={() => this.rename()}
                onChange={e => {
                    this.setState({ name: e.target.value });
                }}
                onClick={e => e.stopPropagation()}
                onKeyDown={e => {
                    let { key } = e;
                    let reset = false;

                    if (/^(escape)/i.test(key)) {
                        key = 'enter';
                        reset = true;
                    }

                    if (/^(enter)/i.test(key)) {
                        this.rename(reset);
                        e.target.blur();
                    }
                }}
            />
        );
    }
}
class Sidebar extends React.Component {
    constructor(props) {
        super();
        this.state = {
            articles: [],
            // current: null,
            previous: null,
            modifiers: {
                collapsed: true,
                strikethrough: true,
                typewriter: false,
                markdown: false,
                dark: false,
            },
            values: {
                fontsize: 24,
            },
        };
    }

    componentDidMount() {
        // update with persisted data
        const settings = read();
        const articles = this.getUpdatedArticles();
        const previous = u.storage('previous').read();
        // const state = {
        //     ...this.state,
        //     articles,
        //     ...settings,
        //     previous,
        // };
        const state = Object.assign(
            {},
            this.state,
            { articles: articles },
            settings,
            { previous }
        );

        // remember setState can lag!
        // don't rely on this.state === state
        this.setState(state);

        // apply the current/persisted modifiers
        for (let key in state.modifiers) {
            this.toggleClassName(key, state.modifiers[key]);
        }

        // apply the variable values
        // these require a callback eg. this.fontsize()
        // that matches state key eg. value.fontsize
        for (let key in state.values) {
            const value = state.values[key];
            this[key] && this[key](value);
        }

        this.registerMouseEvent();
    }

    getUpdatedArticles() {
        const { store } = this.props;
        const articles = store.list();
        return articles;
    }

    registerMouseEvent() {
        const body = document.querySelector('body');
        const sidebar = document.querySelector('#sidebar');
        const zone = [3, sidebar.offsetWidth + 50]; // mouse trigger region
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
                        html.classList.remove("show-alternative");
                    },
                    250
                );
            }

            if (pageX < zone[0] || (showsidebar && pageX < zone[1])) {
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

    fontsize(value) {
        document.querySelector('body').style.fontSize = `${value}px`;
        this.setState({ values: { fontsize: Number(value) } });
        setTimeout(this.save, 250);
    }

    updatePrevious = previous => {
        u.storage('previous').write(previous, true);
        this.setState({ previous: String(previous) });

        this.toggleClassName('sidebar-close', true);
        u.defer(
            'animate',
            () => {
                this.toggleClassName('sidebar-close', false);
                this.toggleClassName('show-sidebar', false);
            },
            350
        );
    };

    getFileRow(object, updatePrevious) {
        const { guid, name, words = 1234, opened } = object;
        const { store, article } = this.props;
        return (
            <div
                className="inner"
                onClick={() => {
                    const fileObj = store.read(guid);
                    const { data } = fileObj;
                    updatePrevious(guid);
                    return article.reset(data);
                }}>
                <span className="file-name" data-guid={guid}>
                    <ToggleToInput name={name} guid={guid} store={store} />
                </span>
                <ul className="file-meta">
                    <li>
                        <a
                            href="#delete"
                            onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                this.handleDelete(guid);
                            }}>
                            del
                        </a>
                    </li>
                    <li className="file-words">{words} words </li>
                    <li className="file-modified">{u.elapsed(opened)}</li>
                    <li className="file-exports">
                        <a href="#txt" onClick={this.download("text")}>txt</a> |
                        <a href="#json" onClick={this.download("json")}>json</a>
                    </li>
                </ul>
            </div>
        );
    }
    getArticles() {
        const { previous } = this.state;
        const files = this.state.articles.map(obj => {
            const row = this.getFileRow(obj, this.updatePrevious);
            const selected = obj.guid === previous ? 'selected' : '';

            return (
                <li key={obj.guid} className={selected}>
                    {row}
                </li>
            );
        });

        return (
            <div id="files">
                <hr />
                <ul>{files}</ul>
            </div>
        );
    }

    save = () => {
        const prev = read() || {}; // remember divider.js also saves settings
        const data = { ...prev, ...this.state };
        delete data.articles;
        write(data);
        return data;
    };

    handleDelete(guid) {
        const { store } = this.props;
        const msg = 'You are about to delete this file.\nAre you sure?';
        if (!window.confirm(msg)) return false;

        store.delete(guid);
        const articles = store.list();
        this.setState({ articles });
    }

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

    toggleClassName(string, value = null, selector = 'body') {
        const { modifiers, values } = this.state;
        const element = document.querySelector(selector);

        let toggle = null;
        toggle = typeof value === 'boolean' ? value : !modifiers[string];
        toggle = Boolean(toggle);

        const method = toggle ? 'add' : 'remove';

        element.classList[method](string);

        if (string in modifiers || string in values) {
            modifiers[string] = toggle;
            this.setState({ modifiers });
            this.save();
        }

        return toggle === true;
    }

    handleImport = e => {
        const { store, article } = this.props;
        const that = this;
        store.open(e, function(name, text) {
            const p = new Parse(text);
            const current = store.create(null, name, p.toCollection());
            article.init(current.data);
            that.setState({ articles: store.list() });
        });
    };

    handleDataRestore = (e) => {
        const {restore} = u.backupRestore;
        const {readTextFile} = u;
        const ns = "rewrite";

        return readTextFile(e, (name, plaintext) => {
            const data = JSON.parse(plaintext);
            const keys = Object.keys(data);
            const valid = keys.filter(k => /(articles|previous|settings)$/i.test(k))

            console.log(valid);
            // restore if there is data integrity
            if (!valid.length === 3) {
                console.error("Restore failed integrity check", data);
                return;
            }

            const contd = u.confirm("You are about to overwrite existing data.\nAre you sure?");
            if(!contd) return;

            Object.keys(localStorage).forEach(k => (k.indexOf() + 1 ? (delete localStorage[k]) : null));
            return restore(ns, data);
        });

    }

    getOnOff(name) {
        const { modifiers } = this.state;
        const bool = modifiers[name];
        return bool ? (
            <i className="icon-boolean-true" />
        ) : (
            <i className="icon-boolean-false" />
        );
    }

    readSelected = e => {
        e.stopPropagation();

        const { selected = null, texteditor = null } = this.props.article;
        const el =
            selected && selected.innerText.trim() ? selected : texteditor;
        if (!el || !el.innerText) return;

        window.TTS.read(el.innerText);
    };

    download = (mime = "text") => {
        const method = {
            text: "toText",
            markdown: "toMarkdown",
            json: "toCollection"
        }[mime] || "text";

        return  (e) => {
            e.preventDefault();
            e.stopPropagation();

            const { previous } = this.state;
            const { store } = this.props;
            const saveAs = e.altKey ? true : false;

            let {data, name, guid} = store.read(previous);
            const date = new Date()
                .toISOString()
                .replace(/:\d+.\d+.$/, "")
                .replace("T", " ");

            // pressing a ket modifier presents the save-as prompt
            name = saveAs ? u.prompt(`Enter filename`, `${name}-${date}`) : name;
            if (!name || !name.trim()) return;

            const p = new Parse(data);
            const object = {
                name,
                id: guid,
                data: p[method](),
                type: mime,
                appendId: false,
            }
            return u.download(object);
        }

    }

    render() {
        const articleList = this.getArticles();
        return (
            <div>
                <ul>
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
                        <div className="inner"
                            onClick={this.download("text")}>
                            <span>Save <i className="on-alternative">As</i></span>
                        </div>
                    </li>
                    <div className="on-alternative">
                    <li>
                        <div className="inner"
                            onClick={() => {
                                const {download, backupRestore} = u;
                                const {backup} = backupRestore;

                                const data = backup("rewrite");
                                const meta = {
                                    name: "rewriting-backup",
                                    id: new Date().toISOString(),
                                    data
                                }
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
                    </div>

                </ul>
                {articleList}
                <ul className="settings">
                    <li>
                        <div
                            className="inner"
                            onClick={() => {
                                this.toggleClassName('dark');
                            }}>
                            <strong>Toggle dark theme</strong>
                            <em>{this.getOnOff('dark')}</em>
                        </div>
                    </li>
                    <li>
                        <div
                            className="inner"
                            onClick={() => {
                                this.toggleClassName('collapsed');
                            }}>
                            <strong>Collapse lines</strong>
                            <em>{this.getOnOff('collapsed')}</em>
                        </div>
                    </li>
                    <li>
                        <div
                            className="inner"
                            onClick={() => {
                                this.toggleClassName('strikethrough');
                            }}>
                            <strong>Strike through</strong>
                            <em>{this.getOnOff('strikethrough')}</em>
                        </div>
                    </li>
                    <li>
                        <div
                            className="inner"
                            onClick={() => {
                                const { article } = this.props;
                                const bool = this.toggleClassName('typewriter');

                                let forward = article.typewriter(bool);
                                forward =
                                    bool === undefined ? !forward : forward;
                                article.typewriter(forward);
                            }}>
                            <strong>Typewriter mode</strong>
                            <em>{this.getOnOff('typewriter')}</em>
                        </div>
                    </li>
                    <li className="no-underline">
                        <div className="inner">
                            <strong>Font size</strong>
                            <em>
                                {[
                                    this.state.values.fontsize,
                                    'px',
                                    '/',
                                    u.points(this.state.values.fontsize),
                                    'pt',
                                ].join('')}
                            </em>
                        </div>
                        <input
                            type="range"
                            id="fontsize"
                            name="fontsize"
                            min="12"
                            max="48"
                            value={this.state.values.fontsize}
                            onChange={e => {
                                const { value } = e.target;
                                this.fontsize(value);
                            }}
                        />
                    </li>
                    <li>
                        <div className="inner" onClick={this.readSelected}>
                            <strong>Read aloud (BETA)</strong>
                            <em>stop|start</em>
                        </div>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Sidebar;
