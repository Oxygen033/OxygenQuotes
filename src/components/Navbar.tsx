import React from 'react';
import "./css/navbar.css"

interface NavbarProps
{
    setTag: () => void;
}

function Navbar({setTag} : NavbarProps)
{
    const SetTag = () => {
        setTag();
        console.log("клик прошёл (внутри функции)");
    };
    return(
        <nav className='navbar'>
            <h1>Oxygen033 Quotes Library</h1>
            <a href="#" onClick={SetTag} className='navlink'><p className='material-symbols-outlined'>home</p><p className='caption'>Home</p></a>
        </nav>
    );
}

export default Navbar;