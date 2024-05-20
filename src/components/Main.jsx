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
import QuestsPage from './quests/QuestsPage';
import MapPage from './maps/MapPage';
import calculateCost from './CostCalculator';
import expCalculator from './ExpCalculator';
import './Main.css';

// const Loading = () => ;
function Loading (props) {
    let mp = props.maxProgress;
    let p = props.progress;
    let percentage = (mp - p) / mp * 100;
    return (
        <div className='loading-base'>
            <div className='loading-container'>
                { props.progress === undefined ? (
                    <h3>Loading TMS...</h3>
                ) : (
                    <div>
                        <div className="progress">
                            <div
                                className="progress-value"
                                style={{width: `${percentage}%`}}
                            />
                        </div>
                        <h3>
                            Loading JSON...
                            {mp - p} / {mp}
                        </h3>
                    </div>
                )}
            </div>
        </div>
    );
}

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expandedSubMenu: false,
            loadJson: true,
        };
        this.temp={};
        this.toggleExpandSubMenu = this.toggleExpandSubMenu.bind(this);
    }

    toggleExpandSubMenu() {
        this.setState({ expandedSubMenu: !this.state.expandedSubMenu, });
    }

    getJsonResources = async (resources) => {
        var downcounter = {progress: 0};
        
        const jsonResourcList = [
            [resources.loadresource_itemcategories, "itemcategories"],
            [resources.loadresource_items, "items"],
            [resources.loadresource_actorconditions, "actorconditions"],
            [resources.loadresource_monsters, "monsters"],
            [resources.loadresource_droplists, "droplists"],
            [resources.loadresource_conversationlists, "conversations"],
            [resources.loadresource_quests, "quests"],
        ];

        // init maxProgress
        const p = jsonResourcList.map(r => r[0].length).reduce((a, b) => a + b, 0);
        this.setState({
            progress: p,
            maxProgress: p,
        });

        // parallelly send out jsonResourcList requests
        await Promise.all(jsonResourcList.map(([loadResource, resourceName]) =>
            this.getJsonResource(loadResource, resourceName, downcounter)
        ));
    }

    getJsonResource = async (resource, name, downcounter) => {
        const that = this;
        downcounter.progress += resource.length;
        await Promise.all(resource.map(
            path => that.getJsonData(path.replace('@','/'), name, that, downcounter)
        ));

        this.setState({progress: this.state.progress - resource.length});
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
    isMerchant = (monster) => {
        if (!monster.droplistLink?.items?.length) return false;
        if (monster.droplistLink.items.length > 1) return true;
        if (monster.droplistLink.items[0].itemID == "gold") return false;
        return true;
    }
    
    getMonsterRootLink = (monster) => {
       const monsterClass = monster.monsterClass || 'other' ;
       if (monster.attackChance || monster.maxHP) return  "/monsters/" + monsterClass + "#";
       if (this.isMerchant(monster)) return "/npc/merchant#";
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

    linkConversationInner(c, conversations){
        if (!c) return
        if (conversations[c.id]) return
        conversations[c.id] = c;

        c.replies?.forEach((r) => {
            this.linkConversationInner(r.next, conversations);
        })
    }
    
    linkConversation = (monster) => {
         const root = monster.conversationLink;
         if (!root) return;
         var conversations = {};
         this.linkConversationInner(root, conversations);

         conversations = Object.values(conversations);
         monster.rewards = conversations.filter((e) => e.rewards?.length);
         monster.requires = conversations.flatMap((e) => e.replies).filter((e) => e?.requires?.length);

         monster.questLinks = monster.rewards
            .flatMap((e) => e.rewards)
            .map((e) => e.link)
            .filter((e) => e)
            .filter(unique)
            .filter((e) => !!e.showInLog)
         monster.questItemsLinks = monster.rewards
            .flatMap((e) => e.rewards)
            .filter((e) => ["inventoryKeep", "inventoryRemove", "wear", "usedItem", "wearRemove", "giveItem", ].indexOf(e.rewardType) >= 0)
         monster.questDropListLinks = monster.rewards
            .flatMap((e) => e.rewards)
            .filter((e) => ["dropList", ].indexOf(e.rewardType) >= 0)



         monster.questLinks?.forEach((e) => {
             e.links = e.links || [];
             e.links.push(monster);
         });
         monster.questItemsLinks?.forEach((e) => {
             //console.log(e);
             const link = e.link;
             link.droplists = link.droplists || [];
             const droplist = {
                 droplist:{
                     links: [ monster ]
                 },
                 type:"quest"
             }
             link.droplists.push(droplist);
         });
         monster.questDropListLinks?.forEach((e) => {
             //console.log(e);
             const droplist = e.link;
             droplist.links = droplist.links || [];
             droplist.links.push(monster);
             droplist.type = "quest";
         });

         /**/
    }

    linkTemp(){
        this.temp.scripts = [];
        this.temp.containers = [];


        this.temp.maps = {};

        this.temp.maps.conditions = this.temp.actorconditions.reduce((obj, item) => Object.assign(obj, { [item.id]: item }), {});
        this.temp.maps.categories = this.temp.itemcategories.reduce((obj, item) => Object.assign(obj, { [item.id]: item }), {});
        this.temp.maps.droplists = this.temp.droplists.reduce((obj, item) => Object.assign(obj, { [item.id]: item }), {});
        this.temp.maps.items = this.temp.items.reduce((obj, item) => Object.assign(obj, { [item.id]: item }), {});
        this.temp.maps.monsters = this.temp.monsters.reduce((obj, item) => Object.assign(obj, { [item.id]: item }), {});
        this.temp.maps.conversations = this.temp.conversations.reduce((obj, item) => Object.assign(obj, { [item.id]: item }), {});
        this.temp.maps.quests = this.temp.quests.reduce((obj, item) => Object.assign(obj, { [item.id]: item }), {});
        this.temp.maps.spawngroups = {};
        this.temp.maps.containers = {};
        this.temp.maps.scripts = {};

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
            map.objectgroups?.scripts?.forEach((script)=> {
                script.rootLink = "/map/" + map.name + "#";
                this.temp.scripts.push(script);
            })
            map.objectgroups?.containers?.forEach((container)=> {
                container.rootLink = "/map/" + map.name + "#";
                this.temp.containers.push(container);
            })
        })

        this.temp.conversations.forEach((c) => {
            const doLink = (req) => {
                const type = req.requireType||req.rewardType;
                const id = req.requireID||req.rewardID;
                if (["questProgress", "questLatestProgress", "removeQuestProgress"].indexOf(type) >= 0) {
                    req.link = this.temp.maps.quests[id];
                    if (!req.link) {debug(req); return}
                    req.link.conv_links = req.link.conv_links || [];
                    req.link.conv_links.push(c);
                } else if (["inventoryKeep", "inventoryRemove", "wear", "usedItem", "wearRemove", "giveItem"].indexOf(type) >= 0) {
                    req.link = this.temp.maps.items[id];
                    if (!req.link) {debug(req); return}
                    req.link.conv_links = req.link.conv_links || [];
                    req.link.conv_links.push(c);
                } else if (type == "dropList") {
                    req.link = this.temp.maps.droplists[id];
                    req.link.conv_links = req.link.conv_links || [];
                    req.link.conv_links.push(c);
                } else if (type == "killedMonster") {
                    req.link = this.temp.maps.monsters[id];
                    req.link.conv_links = req.link.conv_links || [];
                    req.link.conv_links.push(c);
                } else if ([
                    "removeSpawnArea", "spawnAll", "deactivateSpawnArea", 
                    "skillIncrease", 
                    "dropList", 
                    "actorCondition", "hasActorCondition",
                    "factionScore", "factionScoreEquals", "alignmentChange", "alignmentSet",
                    "random",
                    "timerElapsed", "createTimer",
                    "changeMapFilter","deactivateMapObjectGroup","activateMapObjectGroup"
                    ].indexOf(type) >= 0) {
                    // do nothing
                } else {
                    debug(type + " "+id, true)
                }
            }
            c.replies?.forEach((r) => {
                r.next = this.temp.maps.conversations[r.nextPhraseID];
                r.requires?.forEach(doLink);

            })
            c.rewards?.forEach(doLink);
            
        })

        this.temp.scripts.forEach((script) => {

            script.iconID = "items_books:8";
            script.id = script.name;
            script.conversationLink = this.temp.maps.conversations[script.name];
            this.linkConversation(script);
        });
        this.temp.containers.forEach((container) => {
            container.iconID = "items_g03_package_omi1:0";
            container.id = container.name;
            container.droplistLink = this.temp.maps.droplists[container.name];
            if (container.droplistLink) {
                container.droplistLink.links = container.droplistLink.links||[];
                container.droplistLink.links.push(container);
                container.droplistLink.type = "container";
            }
        });
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
                item.priceCost = item.baseMarketCost + Math.trunc(item.baseMarketCost * 0.15);

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

                item.conv_links = item.conv_links?.filter(unique)
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

                monster.conversationLink = this.temp.maps.conversations[monster.phraseID];
                this.linkConversation(monster);
            }
        });
        this.temp.monsters = this.temp.monsters.filter((e)=>e);

        this.temp.droplists.forEach((droplist) => {
                droplist.items.forEach((item) => {
                    item.droplist = droplist;
                    item.link = this.temp.maps.items[item.itemID];
                    item.link.droplists=item.link.droplists||[];
                    item.link.droplists.push(item);
                    item.type = droplist.type;
                })
            }
        );
        this.temp.actorconditions.forEach((condition)=>{
            condition.iconBg = 1;
            condition.rootLink="/conditions#";
        })
        this.temp.quests.forEach((condition)=>{
            condition.rootLink="/quests#";
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
    
    getJsonData = (fileName, name, that, downcounter) =>
        fetch(fileName+".json", {
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(json => {
          that.temp[name] = that.temp[name] || [];
          that.temp[name] = that.temp[name].concat(json);
          downcounter.progress--;
          if (downcounter.progress == 0){
              that.linkTemp()
              that.setState(that.temp);
          }
        })

    componentDidMount() {
       debug(this.props);
    }

    componentDidUpdate() {
        if (!this.state.items && this.state.loadJson) {
            this.setState({loadJson: false});
            this.getJsonResources(this.props.resources);
        }
    }

    render() {

        const style = {
            minHeight: (window.innerHeight - 46),
            paddingTop: 1,
        };

        return (
            <div>
                <div className="content" style={style}>
                    {/* Loading part */}
                    {
                        !this.state.items ? (
                        <Loading
                            progress={this.state.progress}
                            maxProgress={this.state.maxProgress}
                        />
                    ) : (
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
                                <PropsRoute path='/quests' component={QuestsPage} data = { this.state.quests }/> 
                                <PropsRoute path='/map' component={MapPage} data = { this.props.maps } globalMap = { this.props.globalMap }
                                    expanded={this.state.expandedSubMenu} toggleExpand={this.toggleExpandSubMenu}/> 
                            </Switch>
                        </div>
                    )}
                    
                </div>
                <div className="signature">
                    <div style={{float:'left'}}>
                        2022-2024, Powered by <a href="https://github.com/reizy/andors-trail-wiki">Reizy</a>
                    </div>
                    <div style={{float:'right'}}>Game version {process.env.REACT_APP_AT_VERSION}</div>
                </div>
            </div> 
        );
    }
}

function unique(item, pos, self) {
    return self.indexOf(item) == pos;
}