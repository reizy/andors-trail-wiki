import React, { Component } from 'react';
import ConditionsTable from './ConditionsTable';

export default class ItemsPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (!this.props.data) return "Loading...";
        return ( 
                 <div>
                     Positive
                     {
                         <ConditionsTable data = { this.props.data.filter((e)=>e.isPositive)} />
                     }
                     <br/>
                     Negative
                     {
                         <ConditionsTable data = { this.props.data.filter((e)=>!e.isPositive)}  />
                     }
                 </div> 
               );
    }
}
