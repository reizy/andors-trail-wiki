import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default class Main extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <menu>
                <ul className="hr">
                    <li className={window.location.pathname === "/" ? "selected" : ""}>
                        <Link to="">Home</Link>
                    </li>
                    {LiLink("items", "/body")}
                    {LiLink("monsters", "/animal")}
                    {LiLink("NPC", "/merchant")}
                    {LiLink("conditions")}
                    {LiLink("quests")}
                    {LiLink("categories")}
                    {LiLink("map")}
                </ul>
            </menu>
        );
    }
}
const LiLink = (segment, def="") => {
    const to = "/"+segment+def;
    const liClass = (window.location.pathname.toUpperCase().startsWith("/"+segment.toUpperCase()))?"selected":""; 
    return  <li className={liClass}><Link to={to.toLowerCase()}>{segment.capitalize()}</Link></li>
}