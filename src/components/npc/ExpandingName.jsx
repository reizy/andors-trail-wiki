import React from 'react';
import debug from '../../utils/debug';
import MapsList from '../MapsList';
import SellItemsTable from './LinksTable';
import QuestItemsTable from './QuestItemsTable';
import QuestsTable from './QuestsTable';
import '../css/ExpandingName.css';

const fixedBaseHeight = 19.8;
const fixedUnitHeight = 29.8;

const unique = (item, pos, self) => self.indexOf(item) == pos;

export default class ExpandingName extends React.Component {

    constructor(props) {
        super(props);
        
        // use groupLinks to extract how many lines in location cells
        // bind to variable fixedheight
        let maps = this.props.data.spawnGroupLinks;
        if (maps.length > 0) {
            maps = maps[0].maps.filter(unique);
        }
        this.fixedHeight = fixedBaseHeight + (maps.length - 1) * fixedUnitHeight;


        this.state = {
            expanded: window.location.href.endsWith(this.props.data.id.toLowerCase()),
        }
        this.toggleExpand = this.toggleExpand.bind(this);
    }
    toggleExpand() {
        this.setState({ expanded: !this.state.expanded, });
    }

    render() {
        const data = this.props.data;

        const value = this.props.value;
        const links = data.droplistLink?.items;
        const quests = data.questLinks;
        const questItemsLinks = [];
        data.questItemsLinks?.forEach((e)=>questItemsLinks.push(e));
        data.questDropListLinks?.flatMap((e)=>e.link.items)?.forEach((e)=>questItemsLinks.push(e));

        if (!links && !quests?.length && !questItemsLinks?.length) {
            return (
                <React.Fragment>
                    <div style={{ display:'flex'}}>
                        <div style={{ width: 19}} />
                        <span class='expandedText'>{value}</span>
                    </div>
                </React.Fragment>
            );
        }
        return (
            <React.Fragment>
                <div class="expandedLink"
                    style={{height: this.fixedHeight}}
                    onClick={this.toggleExpand}
                >
                    <img src="../image/sort_desc.png" />
                    <span class='expandedText'>{value}</span>
                </div>
                <div class="expandedTable">
                    {(this.state.expanded) && <SellItemsTable data={links}/>}
                    {(this.state.expanded) && <QuestItemsTable data={questItemsLinks}/>}
                    {(this.state.expanded) && <QuestsTable data={quests}/>}
                </div>

            </React.Fragment>
        );
    }
}
