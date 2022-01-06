import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import PropsRoute from '../PropsRoute';
import LiLink from '../LiLink'
import MonstersTable from './MonstersTable';

export default class MonstersPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <ul className="hr">
                        {LiLink("/monsters/", "animal", this.props.location.pathname)}
                        {LiLink("/monsters/", "insect", this.props.location.pathname)}
                        {LiLink("/monsters/", "reptile", this.props.location.pathname)}
                        {LiLink("/monsters/", "undead", this.props.location.pathname)}
                        {LiLink("/monsters/", "giant", this.props.location.pathname)}
                        {LiLink("/monsters/", "ghost", this.props.location.pathname)}
                        {LiLink("/monsters/", "construct", this.props.location.pathname)}
                        {LiLink("/monsters/", "humanoid", this.props.location.pathname)}
                        {LiLink("/monsters/", "demon", this.props.location.pathname)}
                        {LiLink("/monsters/", "other", this.props.location.pathname)}
                </ul>
                <Switch>
                    {ItemRoute("animal", this.props.data)}
                    {ItemRoute("humanoid", this.props.data)}
                    {ItemRoute("insect", this.props.data)}
                    {ItemRoute("undead", this.props.data)}
                    {ItemRoute("giant", this.props.data)}
                    {ItemRoute("reptile", this.props.data)}
                    {ItemRoute("construct", this.props.data)}
                    {ItemRoute("demon", this.props.data)}
                    {ItemRoute("ghost", this.props.data)}
                    <PropsRoute  path="/monsters/other" component={MonstersTable}
                        data = {this.props.data} title= "Other"
                        filter = {(e)=>(e.rootLink=='/monsters/other#')}
                    />
                </Switch>
                 </div> 
               );
    }
}
const ItemRoute = (c, data) => {
    const path = "/monsters/"+c;
    return <PropsRoute  path={path} component={MonstersTable}
                        data = {data} title= {c}
                        filter = {(e)=>(!!(e.attackChance||e.maxHP)&&e.monsterClass==c)}
                    />
}