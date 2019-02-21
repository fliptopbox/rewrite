import React from 'react';
import Parse from '../../utilities/Parse';
import u from '../../utilities/';

const { read, write } = u.storage('settings');

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

    render() {
        const { name, edit } = this.state;
        return !edit ? (
            <span
                className="file-toggle-input"
                onClick={() => this.setState({ edit: true })}>
                {name}
            </span>
        ) : (
            <input
                type="text"
                value={name}
                onBlur={() => this.rename()}
                onChange={e => {
                    this.setState({ name: e.target.value });
                }}
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
            modifiers: {
                collapsed: true,
                strikethrough: true,
                typewriter: false,
                dark: false,
            },
            values: {
                fontsize: 24,
            },
        };
    }

    componentDidMount() {
        // update with persisted data
        const { store } = this.props;
        const local = read();
        const articles = store.list();
        const state = {
            ...this.state,
            articles,
            ...local,
        };

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
    }

    fontsize(value) {
        document.querySelector('body').style.fontSize = `${value}px`;
        this.setState({ values: { fontsize: Number(value) } });
        setTimeout(this.save, 250);
    }

    getArticles() {
        const current = 'a0123456789abcde';
        const files = this.state.articles.map(obj => {
            const row = this.getFileRow(obj);
            const selected = obj.guid === current ? 'selected' : '';
            return (
                <li key={obj.guid} className={selected}>
                    {row}
                </li>
            );
        });

        return <ul>{files}</ul>;
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

    getFileRow(object) {
        const { guid, name, words = 1234, opened } = object;
        const { store, article } = this.props;
        return (
            <div
                className="inner"
                onClick={() => {
                    const fileObj = store.read(guid);
                    const { data } = fileObj;

                    return article.init(data);
                }}>
                <span className="file-name" data-guid={guid}>
                    <ToggleToInput name={name} guid={guid} store={store} />
                </span>
                <div className="file-meta">
                    <a
                        href="#delete"
                        onClick={e => {
                            e.stopPropagation();
                            this.handleDelete(guid);
                        }}>
                        del
                    </a>
                    <i className="file-words">{words} words </i>
                    <i className="file-modified">{opened}</i>
                    <i className="file-exports">
                        <a href="#txt">txt</a>
                        <a href="#json">json</a>
                    </i>
                </div>
            </div>
        );
    }

    toggleClassName(string, value = null, selector = 'body') {
        const { modifiers } = this.state;
        const element = document.querySelector(selector);

        let toggle = null;
        toggle = typeof value === 'boolean' ? value : !modifiers[string];
        toggle = Boolean(toggle);

        const method = toggle ? 'add' : 'remove';

        modifiers[string] = toggle;
        element.classList[method](string);

        this.setState({ modifiers });
        this.save();

        return toggle;
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

    getOnOff(name) {
        const { modifiers } = this.state;
        const bool = modifiers[name];
        return bool ? (
            <i className="icon-boolean-true" />
        ) : (
            <i className="icon-boolean-false" />
        );
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
                        <div className="inner">
                            <label htmlFor="uploadInput">
                                <span>Open</span>
                                <input
                                    id="uploadInput"
                                    className="hidden"
                                    onChange={this.handleImport}
                                    type="file"
                                    accept="text/*"
                                />
                            </label>
                        </div>
                    </li>
                    <li>
                        <div className="inner">Save</div>
                    </li>
                </ul>
                <hr />
                {articleList}
                <hr />
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
                            <strong>Strike</strong>
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
                        <div className="inner">Read paragraph</div>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Sidebar;
