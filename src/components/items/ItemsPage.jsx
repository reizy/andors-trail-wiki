import React, { Component } from 'react';
import ItemsTable from './ItemsTable.jsx';
import PotionsTable from './PotionsTable.jsx';
import { Switch, Route } from 'react-router-dom';
import PropsRoute from '../PropsRoute';
import LiLink from '../LiLink'
import Home from '../Home';

export default class ItemsPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <ul className="hr">
                        {LiLink("/items/", "body", this.props.location.pathname, 'Armor')}
                        {LiLink("/items/", "weapon", this.props.location.pathname)}
                        {LiLink("/items/", "shield", this.props.location.pathname)}
                        {LiLink("/items/", "head", this.props.location.pathname, 'Helm')}
                        {LiLink("/items/", "hand", this.props.location.pathname, 'Glove')}
                        {LiLink("/items/", "feet", this.props.location.pathname, 'Boot')}
                        {LiLink("/items/", "leftring", this.props.location.pathname, 'ring')}
                        {LiLink("/items/", "neck", this.props.location.pathname, 'Necklace')}
                        {LiLink("/items/", "use", this.props.location.pathname, 'Usable')}
                        {LiLink("/items/", "other", this.props.location.pathname)}
                </ul>
                <Switch>
                    {ItemRoute("body", this.props.data)}
                    {ItemRoute("weapon", this.props.data)}
                    {ItemRoute("shield", this.props.data)}
                    {ItemRoute("head", this.props.data)}
                    {ItemRoute("hand", this.props.data)}
                    {ItemRoute("feet", this.props.data)}
                    {ItemRoute("neck", this.props.data)}
                    {ItemRoute("leftring", this.props.data)}
                    <PropsRoute  path='/items/use' component={PotionsTable}
                        data = { this.props.data } title="Usable"
                        filter = {(e)=>(e.categoryLink.actionType=="use")}
                    />
                    <PropsRoute path='/items/other'  component={ItemsTable}
                        data = { this.props.data } title="Other"
                        filter = {(e)=>(!e.categoryLink?.actionType)}
                    />
                </Switch>
            </div> 
               );
    }
}

const ItemRoute = (slot, data) => {
    const path = "/items/"+slot;
    return <PropsRoute  path={path} component={ItemsTable}
                        data = {data} title= {slot}
                        filter = {(e)=>(e.categoryLink.inventorySlot == slot)}
                    />
}