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

    toggleEditAndFocus = e => {
        e.stopPropagation();
        this.setState({ edit: true });
        const { guid } = this.state;
        setTimeout(() => document.querySelector(`#${guid}`).focus(), 150);
    };

    render() {
        const { name, edit, guid } = this.state;
        return !edit ? (
            <span
                className="file-toggle-input"
                onClick={this.toggleEditAndFocus}>
                {name}
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
            current: null,
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
        const local = read();
        const articles = this.getUpdatedArticles();
        const previous = u.storage('previous').read();
        const state = {
            ...this.state,
            articles,
            ...local,
            previous: previous,
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
        this.setState({ previous });
        u.storage('previous').write(previous);

        this.toggleClassName('sidebar-close', true);
        u.defer(
            'animate',
            () => {
                this.toggleClassName('sidebar-close', false);
                this.toggleClassName('show-sidebar', false);
            },
            650
        );
    };

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
                        <a href="#txt">txt</a> | <a href="#json">json</a>
                    </li>
                </ul>
            </div>
        );
    }

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
                        <div className="inner">Read paragraph</div>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Sidebar;
