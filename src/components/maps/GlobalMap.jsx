import React, { Component } from 'react';
import debug from '../../utils/debug'
import Icon from './MapIcon'
import LocalMap from './LocalMap'
import { Link } from 'react-router-dom';

export default class MonstersPage extends React.Component {
    constructor(props) {
        super(props);
    }
    getRowsData = function (data, zoom) {
        var maps = data.maps;
        if (!maps) return "";
 
        return maps.map((row, index)=>{
            var style = {
                left: (row.x - data.x) * zoom,
                top: (row.y - data.y) * zoom,
                width: row.link.width * zoom,
                height: row.link.height * zoom,
            };
            var style2 = {
                width: row.link.width * zoom,
                height: row.link.height * zoom,
            };
            const href = "/map/" + row.id;
            const src = "/backgrounds/" + row.id + ".jpg";
            return (
                <Link style={style} title={row.id} key={index} to={href}>
                    <img style={style2} src={src} />
                </Link>
            )
        })
    }
    render() {
       const { globalMap, location } = this.props;

       var segment = location.pathname.substring("/map/g/".length);
       if (!segment){
           segment = 'world1';
       }

       var data = globalMap.segmentsMap[segment];
       if (!data){ return "Wrong URL!"; }
       debug(data);

       const zoom = (data.maps.length > 100) ? 2 :
                    (data.maps.length >  18) ? 6 :
                    (data.maps.length >   3) ? 8 :
                    10;

       const style = { height:(data.height * zoom)};

       return (
            <div style={style} className="GlobalMap">
                {this.getRowsData(data, zoom)}
            </div>
       );
    }
}