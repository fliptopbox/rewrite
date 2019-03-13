import React from 'react';

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

        this.seGutState({ edit: false, name: value, original: value });
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
                <a href="#edit" onClick={this.toggleEditAndFocus}>
                    edit
                </a>
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

export default ToggleToInput;
