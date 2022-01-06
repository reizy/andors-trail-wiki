import React, { Component } from 'react';
import QuestsTable from './QuestsTable.jsx';
import { Switch, Route } from 'react-router-dom';

export default class ItemsPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
               
                    <QuestsTable
                        data = { this.props.data } title="Usable"
                        filter = {(e)=>(e.showInLog)&&(e.id!="base_nondisplay")}
                    />

            </div> 
        );
    }
}

