import React from 'react';
import u from '../../utilities/';
import Parse from '../../utilities/Parse';

const TTS = u.tts;

class Settings extends React.Component {
    constructor(props) {
        super();
        this.article = props.article;
        this.fs = u.storage('settings');

        this.visible = props.visible;
        this.state = {
            guid: null,
            current: null,
            modifiers: {
                collapsed: true,
                strikethrough: true,
                typewriter: false,
                markdown: false,
                dark: false,
            },
            values: {
                fontsize: 24,
                splitwidth: 50,
            },
            visible: false,
        };

        // register TTS key trigger
        props.keycapture(/^space/i, 'ctrlKey', this.readSelected);
    }

    componentDidMount() {
        const settings = this.fs.read();

        // visibility is a local state
        // remove it to ensure settings visibility is not persisted
        delete settings.visible;

        let state = { ...this.state };
        if (settings) {
            state = {
                ...state,
                ...settings,
            };
            this.setState(state);
        }
        // apply the UI modifiers
        for (let key in state.modifiers) {
            this.toggleClassName(key, state.modifiers[key]);
        }

        // apply the UI values
        for (let key in state.values) {
            if (this[key]) {
                console.log(key, state.values[key]);
                this[key](state.values[key]);
            }
        }
    }

    componentDidUpdate(prevProps) {
        const updates = {};
        if (this.props.current !== prevProps.current) {
            updates.current = this.props.current;
        }
        if (this.props.guid !== prevProps.guid) {
            updates.guid = this.props.guid;
        }
        if (this.props.splitwidth !== prevProps.splitwidth) {
            updates.values = {
                fontsize: this.state.values.fontsize,
                splitwidth: this.props.splitwidth,
            };
        }
        if (this.props.visible !== prevProps.visible) {
            updates.visible = this.props.visible;
        }

        if (Object.keys(updates).length) {
            console.log('settings got new props', updates);
            this.setState({ ...updates });
            this.save();
        }
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
        }

        // only save UI interactions not
        // initialization events that apply persisted values
        // like componentDidMount
        if (value === null) {
            this.setState({ modifiers });
            this.save();
        }

        return toggle === true;
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

        const { selected = null, texteditor = null } = this.article;
        const article = selected
            ? document.createElement('article')
            : texteditor.cloneNode(true);

        // if there is a selected element,
        // create a DOM collection of all following siblings
        if (selected) {
            let p = document.querySelector('.selected');
            while (p) {
                article.appendChild(p.cloneNode(true));
                p = p.nextElementSibling;
            }
        }

        console.log(article.innerText);
        const p = new Parse(article.children, { filterInactive: true });
        const plaintext = p.toText();

        if (!plaintext) return;

        TTS.read(plaintext);
    };

    fontsize(value, persist = false) {
        document.querySelector('body').style.fontSize = `${value}px`;

        if (!persist) return;
        this.setState({ values: { fontsize: Number(value) } });
        u.defer('fontsize', () => this.save(), 500);
    }
    save() {
        // persist settings to localStorage
        // and try to sync with the server
        const { fs } = this;
        u.defer(
            'settings',
            () => {
                fs.write(this.state);
                fs.updateSettings(this.state);
            },
            500
        );
    }

    render() {
        if (!this.state.visible) return null;
        return (
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
                        defaultValue={this.state.values.fontsize}
                        onChange={e => {
                            const { value } = e.target;
                            this.fontsize(value, true);
                        }}
                    />
                </li>
                <li>
                    <div
                        className="inner"
                        onClick={() => {
                            const { article } = this;
                            const bool = this.toggleClassName('typewriter');

                            let forward = article.typewriter(bool);
                            forward = bool === undefined ? !forward : forward;
                            article.typewriter(forward);
                        }}>
                        <strong>Typewriter mode</strong>
                        <em>{this.getOnOff('typewriter')}</em>
                    </div>
                </li>
                <li>
                    <div className="inner" onClick={this.readSelected}>
                        <strong>Read aloud (BETA)</strong>
                        <em>stop|start</em>
                    </div>
                </li>
            </ul>
        );
    }
}

export default Settings;
