import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import PropsRoute from '../PropsRoute';
import LiLink from '../LiLink';
import NpcTable from './NpcTable';

export default class MonstersPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <ul className="hr">
                    {LiLink("/npc/", "merchant", this.props.location.pathname)}
                    {LiLink("/npc/", "A-G", this.props.location.pathname)}
                    {LiLink("/npc/", "H-R", this.props.location.pathname)}
                    {LiLink("/npc/", "S-Z", this.props.location.pathname)}
                </ul>
                <Switch>
                    <PropsRoute  path="/npc/a-g" component={NpcTable}
                        data = {this.props.data} title= "NPC"
                        filter = {(e)=>(e.rootLink=='/npc/a-g#')}
                    />
                    <PropsRoute  path="/npc/h-r" component={NpcTable}
                        data = {this.props.data} title= "NPC"
                        filter = {(e)=>(e.rootLink=='/npc/h-r#')}
                    />
                    <PropsRoute  path="/npc/s-z" component={NpcTable}
                        data = {this.props.data} title= "NPC"
                        filter = {(e)=>(e.rootLink=='/npc/s-z#')}
                    />
                    <PropsRoute  path="/npc/merchant" component={NpcTable}
                        data = {this.props.data} title= "Merchant"
                        filter = {(e)=>(e.rootLink=='/npc/merchant#')}
                    />
                </Switch>
            </div>
        );
    }
}
