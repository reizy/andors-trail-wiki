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
            ["", (o)=> {return <Icon data={o.monster} />;}],
            ["Name", (o)=>{return RenderHref(o.monster)}, { textAlign: 'left'} ],
            ["Quantity",(o)=>{return Range(o.quantity)}],
            ["Chance",(o)=>{return o.monster.maxHP?(o.chance+"%"):"sell"}],

        ];
    }

    getHeader = function () {
        var keys = this.getKeys();
        return keys.map((key, index) => {
            var style = (key.length>=2)?key[2]:{};
            return  <th style={style} key = {key[0]} > {key[0]} </th>
        })
    }

    getRowsData = function (data, filter) {
        if (!data) return "";
        if (filter && filter.length>0) {
            data = data.filter((item)=>filter.indexOf(item.category) > -1);
        }
        var keys = this.getKeys();
        return data.map((row, index)=>{
            return <tr key={index}><RenderRow key={index} data={row} keys={keys}/></tr>
        })
    }

    render() {
        var data = this.props.data;
        if (!data) return "";
        return (
            <table style={{width: 400}} >
                <thead style={{display: 'none'}}><tr>{this.getHeader()}</tr></thead>
                <tbody>{this.getRowsData(data, this.props.filter)}</tbody>
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
const Range = (o) => {
    if (o.max == o.min) return o.max;
    return o.min + "-" + o.max;
}