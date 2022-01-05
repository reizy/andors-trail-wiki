import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import LiLink from '../LiLink'
import PropsRoute from '../PropsRoute';
import LocalMap from './LocalMap';
import GlobalMap from './GlobalMap';

export default class Page extends React.Component {
    constructor(props) {
        super(props);
    }

    getSegmentLinks = function (data, pathname) {
        var segments = data.segments;
        if (!segments) return "";
 
        return segments.map((row, index)=>{
            return LiLink("/map/g/", row.id, pathname, row.id+" ("+row.maps.length+")");
        })
    }
    render() {
        const { data, globalMap, location } = this.props;
        var map = location.pathname.substring("/map/".length);
        if (!data) return "";

        return (
            <div>
                <ul className="hr">
                    <img src="/image/sort_desc.png" style={{float:'left', marginTop:-10}} onClick={this.props.toggleExpand}/>
                    {(this.props.expanded) && this.getSegmentLinks(globalMap, location.pathname)}
                </ul>
                <Switch>
                    {!map && <GlobalMap data = { data } globalMap = { globalMap } />}
                    <PropsRoute path='/map/g' component={GlobalMap} data = { data } globalMap = { globalMap } />
                    <LocalMap data = { data[map] } renderObjectgroupsData="true"/>
                </Switch>
            </div>
        );
    }
}