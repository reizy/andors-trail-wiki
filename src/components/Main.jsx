import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import debug, { doIfDebug } from '../utils/debug'
import PropsRoute from './PropsRoute';
import Menu from './Menu.jsx';
import Home from './Home';
import ItemCategoriesTable from './ItemCategoriesTable.jsx';
import ItemsPage from './items/ItemsPage.jsx';
import ConditionsPage from './conditions/ConditionsPage';
import MonstersPage from './monsters/MonstersPage';
import NpcPage from './npc/NpcPage';
import MapPage from './maps/MapPage';
import calculateCost from './CostCalculator';
import expCalculator from './ExpCalculator';

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            expandedSubMenu: false,
        };
        this.temp={};
        this.toggleExpandSubMenu = this.toggleExpandSubMenu.bind(this);
    }

    toggleExpandSubMenu() {
        this.setState({ expandedSubMenu: !this.state.expandedSubMenu, });
    }

    getJsonResources=(resources)=>{
      var downcounter = {progress:0};
      this.getJsonResource(resources.loadresource_itemcategories, "itemcategories", downcounter);
      this.getJsonResource(resources.loadresource_items, "items", downcounter);
      this.getJsonResource(resources.loadresource_actorconditions, "actorconditions", downcounter);
      this.getJsonResource(resources.loadresource_monsters, "monsters", downcounter);
      this.getJsonResource(resources.loadresource_droplists, "droplists", downcounter);
      this.getJsonResource(resources.loadresource_conversationlists, "conversations", downcounter);

    }

    getJsonResource=(resource, name, downcounter)=>{
      const that = this;
      downcounter.progress+=resource.length;
      resource.forEach((path)=>{
          that.getJsonData(path.replace('@','/'), name, that, downcounter);
      });
    }
    countConditions = (effect, item, type) => {
        var count =  effect?.addedConditions?.length||0;
        count += effect?.conditionsTarget?.length||0;
        count += effect?.conditionsSource?.length||0;
        count += (effect?.increaseCurrentAP)?1:0; 
        count += (effect?.increaseCurrentHP)?0.9:0; // for potions
        return count;
    }
    linkConditions = (effect, item, type) => {
        effect?.addedConditions?.forEach((e)=>this.linkCondition(e, item, type, "On source"));
        effect?.conditionsTarget?.forEach((e)=>this.linkCondition(e, item, type, "On target"));
        effect?.conditionsSource?.forEach((e)=>this.linkCondition(e, item, type, "On source"));
    }
    getStub = (item, condition, type, aim) => {

        let {id, name, category, iconID, displaytype, rootLink} = item;
        let {chance, duration, magnitude} = condition;
        return {id, name, category, iconID, displaytype, chance, duration, magnitude, type, aim, rootLink};
    }
    linkCondition = (condition, item, type, aim) => {
        condition.link = this.temp.maps.conditions[condition.condition];
        condition.link.links = condition.link.links||[];
        const stub = this.getStub(item, condition, type, aim);
        condition.link.links.push(stub);
    }
    getItemRootLink = (category) => {
       if (category.actionType == "use") return "/items/use#";
       if (category.actionType == "equip") return "/items/" + category.inventorySlot + "#";
       return "/items/other#";
    }
    getMonsterRootLink = (monster) => {
       const monsterClass = monster.monsterClass || 'other' ;
       if (monster.attackChance || monster.maxHP) return  "/monsters/" + monsterClass + "#";
       if (monster.droplistID) return "/npc/merchant#";
       if (monster.name.charAt(0).toUpperCase()<='G') return "/npc/a-g#";
       if (monster.name.charAt(0).toUpperCase()<='R') return "/npc/h-r#";
       return "/npc/s-z#";
    }
    getItemIconBg = (o) => {
        switch(o.displaytype) {
            case 'legendary': return  -4;
            case 'extraordinary': return  -2;
            case 'rare': return  -3;
            case 'quest': return  -1;
            default: return 1;
        }
    }

    linkTemp(){
        this.temp.maps = {};

        this.temp.maps.conditions = this.temp.actorconditions.reduce((obj, item) => Object.assign(obj, { [item.id]: item }), {});
        this.temp.maps.categories = this.temp.itemcategories.reduce((obj, item) => Object.assign(obj, { [item.id]: item }), {});
        this.temp.maps.droplists = this.temp.droplists.reduce((obj, item) => Object.assign(obj, { [item.id]: item }), {});
        this.temp.maps.items = this.temp.items.reduce((obj, item) => Object.assign(obj, { [item.id]: item }), {});
        this.temp.maps.monsters = this.temp.monsters.reduce((obj, item) => Object.assign(obj, { [item.id]: item }), {});
        this.temp.maps.conversations = this.temp.conversations.reduce((obj, item) => Object.assign(obj, { [item.id]: item }), {});
        this.temp.maps.spawngroups = {};

        Object.values(this.props.maps).forEach((map)=>{
            map.rootLink = "/map/";
            map.objectgroups?.spawn?.forEach((spawn)=> {
                const key = (spawn.spawngroup || spawn.name).toLowerCase();
                spawn.link = this.temp.maps.spawngroups[key]||{ maps:[], monsters: []};
                spawn.link.key = key;
                spawn.link.maps.push(map);
                this.temp.maps.spawngroups[key] = spawn.link;
            })
            map.objectgroups?.signs?.forEach((sign)=> {
                sign.message = this.temp.maps.conversations[sign.name]?.message;
            })
        })

        this.temp.items.forEach((item, index) => {
            if (this.temp.maps.items[item.id] != item) {
                console.warn("More than one item with id '" + item.id + "'");
                console.warn(item);
                this.temp.items.splice(index, 1, false);
            } else {
                item.displaytype = item.displaytype||'ordinary';
                item.iconBg = this.getItemIconBg(item);
                item.categoryLink = this.temp.maps.categories[item.category];
                item.rootLink=this.getItemRootLink(item.categoryLink);
                item.baseMarketCost=calculateCost(item, item.categoryLink.inventorySlot=="weapon");

                item.conditionsCount = this.countConditions(item.equipEffect)
                    + this.countConditions(item.hitEffect)
                    + this.countConditions(item.hitReceivedEffect)
                    + this.countConditions(item.killEffect)
                    + this.countConditions(item.useEffect);

                this.linkConditions(item.equipEffect, item, "equipEffect");
                this.linkConditions(item.hitEffect, item, "hitEffect");
                this.linkConditions(item.hitReceivedEffect, item, "hitReceivedEffect");
                this.linkConditions(item.killEffect, item, "killEffect");
                this.linkConditions(item.useEffect, item, "useEffect");
            }
        });
        this.temp.items = this.temp.items.filter((e)=>e);

        this.temp.monsters.forEach((monster, index) => {
            if (this.temp.maps.monsters[monster.id] != monster) {
                doIfDebug(() => {
                    console.warn("More than one monster with id '" + monster.id + "'");
                    console.warn(monster);
                });
                this.temp.monsters.splice(index, 1, false);
            } else {
                monster.iconBg = monster.unique? -0 : 1;
                monster.exp = expCalculator(monster);
                monster.droplistLink = this.temp.maps.droplists[monster.droplistID];
                if (monster.droplistLink) {
                    monster.droplistLink.links = monster.droplistLink.links||[];
                    monster.droplistLink.links.push(monster);
                }
                monster.rootLink = this.getMonsterRootLink(monster);

                monster.conditionsCount = this.countConditions(monster.hitEffect)
                    + this.countConditions(monster.hitReceivedEffect)
                    + this.countConditions(monster.killEffect);

                this.linkConditions(monster.hitEffect, monster, "hitEffect");
                this.linkConditions(monster.hitReceivedEffect, monster, "hitReceivedEffect");
                this.linkConditions(monster.killEffect, monster, "killEffect");

                monster.spawnGroupLinks = [];

                var spawngroupLink = this.temp.maps.spawngroups[monster.id.toLowerCase()] 
                if (spawngroupLink) {
                    spawngroupLink.monsters.push(monster);
                    monster.spawnGroupLinks.push(spawngroupLink);
                }
                if (monster.spawnGroup && (monster.spawnGroup?.toLowerCase() != monster.id.toLowerCase())){
                    spawngroupLink = this.temp.maps.spawngroups[monster.spawnGroup?.toLowerCase()] 
                    if (spawngroupLink) {
                        spawngroupLink.monsters.push(monster);
                        monster.spawnGroupLinks.push(spawngroupLink);
                    }
                }

                doIfDebug(() => {
                    if (monster.spawnGroupLinks.length == 0) {
                         console.warn("Monster have no spawn");
                         console.warn(monster);
                    }
                })
            }
        });
        this.temp.monsters = this.temp.monsters.filter((e)=>e);

        this.temp.droplists.forEach((droplist) => {
                droplist.items.forEach((item) => {
                    item.droplist=droplist;
                    item.link = this.temp.maps.items[item.itemID];
                    item.link.droplists=item.link.droplists||[];
                    item.link.droplists.push(item);
                })
            }
        );
        this.temp.actorconditions.forEach((condition)=>{
            condition.iconBg = 1;
            condition.rootLink="/conditions#";
        })
        this.props.globalMap.segments.forEach((segment)=>{
            segment.rootLink = "/map/g/";
            segment.maxY = -9999;
            segment.minY = +9999;
            segment.maps.forEach((map)=>{
                map.link = this.props.maps[map.id];
                if (map.link.segmentLink && (map.link.segmentLink.id != segment.id)) {
                    doIfDebug(() => {
                        console.warn(`Map '${map.id}' lined with 2 segments: ${map.link.segmentLink.id}, ${segment.id}`);
                    });
                } else {
                    map.link.globalMapLink = map;
                    map.link.segmentLink = segment;
                }
                segment.maxY = Math.max(segment.maxY, map.y + map.link.height);
                segment.minY = Math.min(segment.minY, map.y);
            })
            segment.height = segment.maxY - segment.minY;
        })

        this.temp.monsters.sort((a,b) => (a.id.localeCompare(b.id)));

        debug(this.temp);
    }
    
    getJsonData=(fileName, name, that, downcounter)=>{
        fetch(fileName+".json"
        ,{
            headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            }
        })
        .then(function(response){
            return response.json();
        })
        .then(json => {
          that.temp[name] = that.temp[name]||[];
          that.temp[name] = that.temp[name].concat(json);
          downcounter.progress--;
          if (downcounter.progress == 0){
              that.linkTemp()
              that.setState(that.temp);
          }
        });
    }

    componentDidMount() {
       debug(this.props);
       this.getJsonResources(this.props.resources);
    }

    render() {
        if (!this.state.items) return <Home />;
        return (
            <div>
                <Switch>
                    <Menu />
                </Switch>
                <Switch>
                    
                    <Route exact path='/' component={Home}/>
                    <PropsRoute path='/items' component={ItemsPage} data = { this.state.items }/>
                    <PropsRoute path='/conditions' component={ConditionsPage} data = { this.state.actorconditions }/>
                    <PropsRoute path='/monsters' component={MonstersPage} data = { this.state.monsters }/>
                    <PropsRoute path='/categories' component={ItemCategoriesTable} data = { this.state.itemcategories }/> 
                    <PropsRoute path='/npc' component={NpcPage} data = { this.state.monsters }/> 
                    <PropsRoute path='/map' component={MapPage} data = { this.props.maps } globalMap = { this.props.globalMap }
                        expanded={this.state.expandedSubMenu} toggleExpand={this.toggleExpandSubMenu}/> 
                </Switch>
                <div className="signature">
                    <div style={{float:'left'}}>
                        2021, Powered by <a href="https://github.com/reizy/andors-trail-wiki">Reizy</a>
                    </div>
                    <div style={{float:'right'}}>Game version 0.7.13</div>
                </div>
            </div> 
        );
    }
}
