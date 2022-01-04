import React, { Component } from 'react';
import Icon from '../Icon';
import { HashLink as Link } from 'react-router-hash-link';

export default class Table extends React.Component {

    constructor(props) {
        super(props);
        this.getHeader = this.getHeader.bind(this);
        this.getRowsData = this.getRowsData.bind(this);
        this.getKeys = this.getKeys.bind(this);
    }
    getKeys = function () {
        return [
            ["", (o)=> {return <Icon data={o.link} />;}, { width: 40}],
            ["Name", (o)=>{return RenderHref(o.link)}, { textAlign: 'left', width: 250} ],
            ["Quantity",(o)=>{return Range(o.quantity)}],
            ["By quest", (o)=> "give by quest" ],
            
        ];
    }

    getHeader = function () {
        var keys = this.getKeys();
        return keys.map((key, index) => {
            var style = (key.length>=2)?key[2]:{};
            return  <th style={style} key = {key[0]} > {key[0]} </th>
        })
    }

    getRowsData = function (items) {
        if (this.props.filter && this.props.filter.length>0) {
            items = items.filter((item)=>this.props.filter.indexOf(item.category) > -1);
        }
        var keys = this.getKeys();
        return items.map((row, index)=>{
            return <tr key={index}><RenderRow key={index} data={row} keys={keys}/></tr>
        })
    }

    render() {
        var data = this.props.data;
        if (!data) return "";

        return (
            <table style={{width: 500}} >
                <thead style={{display: 'none'}}><tr>{this.getHeader()}</tr></thead>
                <tbody>{this.getRowsData(data)}</tbody>
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
    return <Link to={href}>{o.name}</Link>
}
const Range = (o) => {
    if (o?.max == o?.min) return o?.max;
    return o.min + "-" + o.max;
}