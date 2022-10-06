import React, { Component } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import MapIcon from './MapIcon'
import Icon from '../Icon'
import debug from '../../utils/debug'

const bySpawnGroup = (a, b) => {
    a = a.spawngroup||a.name||"";
    b = b.spawngroup||b.name||"";
    return a.localeCompare(b);
};

export default class MonstersPage extends React.Component {
    constructor(props) {
        super(props);
    }

    drawLayerByName = function (data, zoom, name) {
        var field = data.field;
        if (!field) return "";
        var layers = data.layerList.filter((e,i) => e.name == name);

        return field.map((row, index)=>{
            return <RenderRow key={index} data={row} layers={layers} y={index} zoom={zoom}/>
        })
    }

    renderSpawn = function (spawn, zoom) {
        if (!spawn) return "";
        var index = 0;
        return spawn.sort(bySpawnGroup).map((row) => {
            const link = row.link;
            if (!link) return "";

            var className = "mapspawn";
            const hash = this.props.location?.hash;
            if ((hash == '#'+row.name)||(hash == '#'+row.spawngroup)) {
                className = className + " active"; 
            }
            const quantity = (row.quantity || 1) - 0;
            const result = [];
            for (let i = 0; i < quantity; i++) {
                index++;
                const style = { 
                    left: row.x + getRandomInt(row.width - 32), 
                    top: row.y + getRandomInt(row.height - 32),
                };
                var monster = link.monsters[index%link.monsters.length];
                if (monster) {
                    const key = monster.id+"_"+index;
                    result.push(
                        <div key ={key} style={style} className={className} title={monster.name}>
                            <Icon data={monster} zoom={zoom} noBackground="true" />
                        </div>
                    )
                }
            }
            return result;
        })
    }
    renderScript = function (script, zoom) {

        if (!script) return "";
        return script.map((row) => {
            var className = "script"
            const hash = this.props.location?.hash;
            if (hash == '#'+row.name) {
                className = className + " active"; 
            }
            const result = [];

            const style = { 
                left: row.x, 
                top: row.y,
                width: row.width,
                height: row.height,
            };

            const key = row.name;
            result.push(
                    <div key ={key} style={style} className={className} title={row.name}/>
            )
            
            return result;
        })
    }

    renderMapchange = function (events, zoom) {
        if (!events) return "";
        return events.map((row, index) => {
            const style = { 
                marginLeft: row.x, 
                marginTop: row.y,
                width: row.width,
                height: row.height,
            };
            var className = "mapchange";
            if (this.props.location?.hash == '#'+row.name) {
                className = className + " active";
            }
            const href = "/map/" + row.map + "#" + row.place;
            return (
                <Link key ={index} style={style} title={row.map} to={href} className={className}/>
            )
        })
    }

    renderSign = function (signs, zoom) {
        if (!signs) return "";

        return signs.map((row, index) => {
            const style = { 
                marginLeft: row.x, 
                marginTop: row.y,
                width: row.width,
                height: row.height,
            };
            return <div key ={index} style={style} title={row.message} className="sign"/>;
        })
    }

    renderObjectgroups = function (data, zoom) {
        return (
                <div className="objectgroups">
                    {this.renderScript(data?.scripts)}
                    {this.renderScript(data?.containers)}
                    {this.renderSpawn(data?.spawn)}
                    {this.renderMapchange(data?.mapchange)}
                    {this.renderSign(data?.signs)}
                </div>
            )
        
    }

    render() {
       var data = this.props.data;
       var renderOG = this.props.renderObjectgroupsData;
       var zoom = this.props.zoom || 32;

       if (!data) {
           return "Wrong URL!"; 
       }

       renderOG && debug(this.props.data);

       var width = zoom * data.width;
       var height = zoom * data.height;

       return (
            <div style={{backgroundColor:'white', width:width, height:height, position:'relative', margin:'auto' }}>
                {this.drawLayerByName(data, zoom, "base")}
                {this.drawLayerByName(data, zoom, "ground")}
                {this.drawLayerByName(data, zoom, "objects")}
                {this.drawLayerByName(data, zoom, "objects_1")}

                {this.drawLayerByName(data, zoom, "above")}
                {this.drawLayerByName(data, zoom, "top")}

                {renderOG && <div style={{position: 'absolute'}}>{this.renderObjectgroups(data.objectgroups, zoom)}</div>}

            </div>
       );
    }
}
const RenderRow = (props) => {
    const {data, layers, y, zoom} = props;
    return data.map((tile, index) => <RenderCell data={tile} layers={layers} x={index*zoom} y={y*zoom} zoom={zoom} key ={index}/>) 
}
const RenderCell = (props) => {
    const {data, layers, x, y, zoom} = props;
    return layers
            .map((l) => data[l.name])
            .filter((ld)=>ld)
            .map((ld, index) => {
        return <MapIcon data={ld} x={x} y={y} zoom={zoom} key ={index}/>
    });
}
function getRandomInt(max) {
  return Math.floor(Math.random() * (max + 1)); //Максимум и минимум включаются
}