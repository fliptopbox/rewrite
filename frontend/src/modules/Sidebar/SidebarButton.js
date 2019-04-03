import React from 'react';

function SidebarButton(props) {
    const { value, text, mode, handler } = props;

    return (
        <a
            href="#show-settings"
            className={
                'sidebar-mode-toggle' + (mode === value ? ' selected' : '')
            }
            onClick={e => {
                e.preventDefault();
                handler(value);
            }}>
            {text}
        </a>
    );
}

export default SidebarButton;
