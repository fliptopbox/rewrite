import React from 'react';

function Logo() {
    return <div className="logo">LOGO</div>;
}

function Notifications() {
    return (
        <div className="notifications">
            <em>23</em>
        </div>
    );
}

function User() {
    return <div className="user">USER</div>;
}

function Status() {
    return <div className="status" />;
}

function Header() {
    return (
        <header>
            <Logo />
            <Status>
                <Notifications />
                <User />
            </Status>
        </header>
    );
}

export default Header;
