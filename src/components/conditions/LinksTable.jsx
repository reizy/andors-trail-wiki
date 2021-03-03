import React, { Component } from 'react';
import Icon from '../Icon';

export default class Table extends React.Component {

    constructor(props) {
        super(props);
        this.getHeader = this.getHeader.bind(this);
        this.getRowsData = this.getRowsData.bind(this);
        this.getKeys = this.getKeys.bind(this);
    }
    getKeys = function () {
        return [
            ["", (o)=> {return <Icon data={o}/>;}],
            ["Name", (o)=>{return RenderHref(o)}, { textAlign: 'left'} ],
            ["Type",(o)=>o.type],
            ["Aim",(o)=>o.aim],
            ["Chance",(o)=>{return o.chance?(o.chance + "%"):""}],
            ["Magnitude",(o)=>{return o.magnitude + "x"}],
            ["Duration",(o)=>{return o.duration?(o.duration + " rounds"):""}],
        ];
    }

    getHeader = function () {
        var keys = this.getKeys();
        return keys.map((key, index) => {
            var style = (key.length>=2)?key[2]:{};
            return  <th style={style} key = {key[0]} > {key[0]} </th>
        })
    }

    getRowsData = function () {
        var items = this.props.data;
        if (!items) return "";
        if (this.props.filter && this.props.filter.length>0) {
            items = items.filter((item)=>this.props.filter.indexOf(item.category) > -1);
        }
        var keys = this.getKeys();
        return items.map((row, index)=>{
            return <tr key={index}><RenderRow key={index} data={row} keys={keys}/></tr>
        })
    }

    render() {
        return (
            <table style={{width: 700}} >
                <thead style={{display: 'none'}}><tr>{this.getHeader()}</tr></thead>
                <tbody>{this.getRowsData()}</tbody>
            </table>
        );
    }
}
const RenderRow = (props) => {
    return props.keys.map((key, index) => {
        var style = (key.length>=2)?key[2]:{};
        return <td style={style} key ={key[0]}>{key[1](props.data)}</td>
    })
}
const RenderHref = (o) => {
    const href = o.rootLink + o.id;
    return  <a href={href}>{o.name}</a>

}