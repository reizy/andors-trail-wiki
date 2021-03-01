import React, { Component } from 'react';

export default class Table extends React.Component {

    constructor(props) {
        super(props);
        this.getHeader = this.getHeader.bind(this);
        this.getRowsData = this.getRowsData.bind(this);
        this.getKeys = this.getKeys.bind(this);
    }

    getKeys = function () {
        return [
        ["name", (o)=>o.name],
        ["id",(o)=>o.id],
        ["size",(o)=>o.size],
        ["inventorySlot",(o)=>o.inventorySlot],
        ["actionType",(o)=>o.actionType],


        ];
    }

    getHeader = function () {
        var keys = this.getKeys();
        return keys.map((key, index) => {
            return  <th key = {key[0]} > {key[0]} </th>
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
             <div>
                 <table border='1'>
                     <thead>
                         <tr>{this.getHeader()}</tr>
                     </thead>
                     <tbody>{this.getRowsData()}</tbody>
                 </table>
             </div> );
    }
}
const RenderRow = (props) => {
    return props.keys.map((key, index) => {
        return  <td key ={key[0]} > {key[1](props.data)} </td>
    })
}
