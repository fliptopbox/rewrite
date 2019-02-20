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
        const files = this.state.articles.map(obj => {
            return this.getFileRow(obj);
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
            <li
                key={guid}
                onClick={() => {
                    const fileObj = store.read(guid);
                    const { data } = fileObj;

                    return article.init(data);
                }}>
                <span className="file-name" data-guid="{guid}">
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
            </li>
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
        return bool ? '--o' : 'o--';
    }

    render() {
        const articleList = this.getArticles();
        return (
            <div>
                <ul>
                    <li
                        onClick={() => {
                            this.props.store.create(null, 'Untitled', [{}]);
                            this.props.article.init([{}]);
                            return;
                        }}>
                        New
                    </li>
                    <li>
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
                    </li>
                    <li>Save</li>
                </ul>
                <hr />
                {articleList}
                <hr />
                <ul>
                    <li
                        onClick={() => {
                            this.toggleClassName('dark');
                        }}>
                        Toggle dark theme ({this.getOnOff('dark')})
                    </li>
                    <li
                        onClick={() => {
                            this.toggleClassName('collapsed');
                        }}>
                        Collapse lines ({this.getOnOff('collapsed')})
                    </li>
                    <li
                        onClick={() => {
                            this.toggleClassName('strikethrough');
                        }}>
                        Strike through ({this.getOnOff('strikethrough')})
                    </li>
                    <li
                        onClick={() => {
                            const { article } = this.props;
                            const bool = this.toggleClassName('typewriter');

                            let forward = article.typewriter(bool);
                            forward = bool === undefined ? !forward : forward;
                            article.typewriter(forward);
                        }}>
                        Typewiter mode ({this.getOnOff('typewriter')})
                    </li>
                    <li>
                        <span>Font size</span>
                        {[
                            this.state.values.fontsize,
                            'px',
                            '/',
                            u.points(this.state.values.fontsize),
                            'pt',
                        ].join('')}
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
                    <li>Read paragraph</li>
                </ul>
            </div>
        );
    }
}

export default Sidebar;
