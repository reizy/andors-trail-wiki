import React, { Component } from 'react';
import ConditionsTable from './ConditionsTable';

export default class ItemsPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return ( 
            <div>
                <h2>Positive</h2>
                <ConditionsTable data = { this.props.data.filter((e)=>e.isPositive)} />
                <h2>Negative</h2>
                <ConditionsTable data = { this.props.data.filter((e)=>!e.isPositive)} />
            </div> 
        );
    }
}
