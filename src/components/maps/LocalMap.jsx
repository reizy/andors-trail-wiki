import React, { Component } from 'react';
import MapIcon from './MapIcon'
import Icon from '../Icon'
import debug from '../../utils/debug'

export default class MonstersPage extends React.Component {
    constructor(props) {
        super(props);
    }
    getRowsData = function (data, zoom) {
        var field = data.field;
        if (!field) return "";
 
        return field.map((row, index)=>{
            return <RenderRow key={index} data={row} y={index} zoom={zoom}/>
        })
    }
    getObjectgroupsData = function (data, zoom) {
        var spawn = data?.spawn;
        if (!spawn) return "";
 
        return spawn.map((row, index)=>{
            if (!row.link) return "";
            const style = { 
                marginLeft: row.x + (row.width - 32)/2, 
                marginTop: row.y + (row.height - 32)/2 ,
                position: 'absolute',
            };
            if (this.props.location?.hash == '#'+row.spawngroup) {
                style.border = "solid yellow 1px" 
            }
            if (this.props.location?.hash == '#'+row.name) {
                style.border = "solid yellow 1px" 
            }
            return (
                <div key ={index} style={style} >
                    <Icon data={row.link.monsters[0]} zoom={zoom} noBackground="true" />
                </div>
            )
        })
    }
    render() {
       var data = this.props.data;
       var zoom = this.props.zoom || 32;

       if (!data) {
           return "Wrong URL!"; 
       }

       debug(this.props);

       var width = zoom * data.width;
       var height = zoom * data.height;

       return (
            <div style={{backgroundColor:'white', width:width, height:height, position:'relative' }}>
                {this.getRowsData(data, zoom)}
                <div style={{position: 'absolute'}}>{this.getObjectgroupsData(data.objectgroups, zoom)}</div>
            </div>
       );
    }
}
const RenderRow = (props) => {
    const {data, y, zoom} = props;
    return data.map((tile, index) => {
        return (<div key ={index}>
                    {tile.ground && <MapIcon data={tile.ground} x={index*zoom} y={y*zoom} zoom={zoom}/>}
                    {tile.objects && <MapIcon data={tile.objects} x={index*zoom} y={y*zoom} zoom={zoom}/>}
                    {tile.above && <MapIcon data={tile.above} x={index*zoom} y={y*zoom} zoom={zoom}/>}
                </div>          
        ) 
    });
}
