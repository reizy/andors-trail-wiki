import React, { Component } from 'react';
import GridTable from '@nadavshaar/react-grid-table';
import '../../@nadavshaar/react-grid-table/dist/index.css';
import IconCell from "../cells/IconCell";
import NameCell from "./NameCell";
import TableAbsHeader from "../TableAbsHeader";
import JsonCell from "../cells/JsonCell";
import OtherCell from "../cells/OtherCell";
import RangeCell from "../cells/RangeCell";
import BooleanCell from "../cells/BooleanCell";

const sortStr = ({a, b, isAscending}) => {
    let aa = a||"";
    let bb = b||"";
    if(aa > bb) return isAscending ? 1 : -1; 
    if(aa < bb) return isAscending ? -1 : 1; 
    return 0; 
}
const sortInt = ({a, b, isAscending}) => {
    let aa = a||0;
    let bb = b||0;
    if(aa > bb) return isAscending ? 1 : -1; 
    if(aa < bb) return isAscending ? -1 : 1; 
    return 0; 
}

const aInt = ({a, b, isAscending}) => {
    let aa = a||0;
    let bb = b||0;
    if(aa > bb) return isAscending ? 1 : -1; 
    if(aa < bb) return isAscending ? -1 : 1; 
    return 0; 
}

const hashLinkScroll = () => {
  const { hash } = window.location;
  if (hash !== '') {
    setTimeout(() => {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) element.scrollIntoView();
    }, 100);
  }
}

export default class Table extends React.Component {

    constructor(props) {
        super(props);

        this.state={};

        this.getColumns = this.getColumns.bind(this);
        this.getRows = this.getRows.bind(this);

        this.id="CondinionTable"+Math.random();
    }

    getRows  = function () {
        var items = this.props.data;
        if (this.props.filter) {
            items = items.filter((item)=>this.props.filter.indexOf(item.category) > -1);
        }

        return items;
    }
    isEmptyColumn = function (f) {
        return !!this.rows.find((e)=>f(e));
    }
    getColumns  = function () {
        var i = 1;
        return [
            {
                id: i++,
                field: 'displaytype',
                label: '',
                pinned: true,
                cellRenderer: IconCell,
                width: '50px',
            },
            {
                id: i++,
                field: 'name',
                label: 'Name',
                pinned: true,
                cellRenderer: NameCell,
                width: '300px',
            },
            {
                id: i++,
                field: 'category',
                label: 'Category',
                width: '120px',
            },
            {
                id: i++,
                field: 'isStacking',
                label: 'Stack',
                cellRenderer: BooleanCell,
                sort:sortInt,
                width: '80px',
            },
            {
                id: i++,
                field: 'abilityEffect',
                label: 'HP',
                getValue: ({value, column}) => value?.increaseMaxHP,
                sort:sortInt,
                width: '62px',
                visible: this.isEmptyColumn((item)=>item.abilityEffect?.increaseMaxHP),
            },
            {
                id: i++,
                field: 'abilityEffect',
                label: 'AC',
                getValue: ({value, column}) => value?.increaseAttackChance,
                sort:sortInt,
                width: '62px',
                visible: this.isEmptyColumn((item)=>item.abilityEffect?.increaseAttackChance),
            },
            {
                id: i++,
                field: 'abilityEffect',
                label: 'Dmg',
                getValue: ({value, column}) => ((value?.increaseAttackDamage?.min||0)+(value?.increaseAttackDamage?.max||0))/2,
                cellRenderer: RangeCell("abilityEffect","increaseAttackDamage"),
                width: '78px',
                visible: this.isEmptyColumn((item)=>item.abilityEffect?.increaseAttackDamage),
            },
            {
                id: i++,
                field: 'abilityEffect',
                label: 'Crit',
                getValue: ({value, column}) => value?.increaseCriticalSkill,
                sort:sortInt,
                width: '70px',
                visible: this.isEmptyColumn((item)=>item.abilityEffect?.increaseCriticalSkill),
            },
            {
                id: i++,
                field: 'abilityEffect',
                label: 'BC',
                getValue: ({value, column}) => value?.increaseBlockChance,
                sort:sortInt,
                width: '60px',
                visible: this.isEmptyColumn((item)=>item.abilityEffect?.increaseBlockChance),
            },
            {
                id: i++,
                field: 'abilityEffect',
                label: 'Resist',
                getValue: ({value, column}) => value?.increaseDamageResistance,
                sort:sortInt,
                width: '82px',
                visible: this.isEmptyColumn((item)=>item.abilityEffect?.increaseDamageResistance),
            },
            {
                id: i++,
                field: 'abilityEffect',
                label: 'AP',
                getValue: ({value, column}) => value?.increaseMaxAP,
                sort:sortInt,
                width: '60px',
                visible: this.isEmptyColumn((item)=>item.abilityEffect?.increaseMaxAP),
            },
            {
                id: i++,
                field: 'abilityEffect',
                label: 'Atk cost',
                getValue: ({value, column}) => value?.increaseAttackCost,
                sort:sortInt,
                width: '100px',
                visible: this.isEmptyColumn((item)=>item.abilityEffect?.increaseAttackCost),
            },
            {
                id: i++,
                field: 'abilityEffect',
                label: 'Move cost',
                getValue: ({value, column}) => value?.increaseMoveCost,
                sort:sortInt,
                width: '115px',
                visible: this.isEmptyColumn((item)=>item.abilityEffect?.increaseMoveCost),
            },
            {
                id: i++,
                field: 'abilityEffect',
                label: 'Use cost',
                getValue: ({value, column}) => value?.increaseUseItemCost,
                sort:sortInt,
                width: '105px',
                visible: this.isEmptyColumn((item)=>item.abilityEffect?.increaseUseItemCost),
            },
            {
                id: i++,
                field: 'abilityEffect',
                label: 'Equip cost',
                getValue: ({value, column}) => value?.increaseReequipCost,
                sort:sortInt,
                width: '115px',
                visible: this.isEmptyColumn((item)=>item.abilityEffect?.increaseReequipCost),
            },
            {
                id: i++,
                field: 'roundEffect',
                label: 'Round HP',
                getValue: ({value, column}) => ((value?.increaseCurrentHP?.min||0)+(value?.increaseCurrentHP?.max||0))/2,
                cellRenderer: RangeCell("roundEffect","increaseCurrentHP"),
                sort:sortInt,
                width: '115px',
                visible: this.isEmptyColumn((item)=>item.roundEffect?.increaseCurrentHP),
            },
            {
                id: i++,
                field: 'roundEffect',
                label: 'Round AP',
                getValue: ({value, column}) => ((value?.increaseCurrentAP?.min||0)+(value?.increaseCurrentAP?.max||0))/2,
                cellRenderer: RangeCell("roundEffect","increaseCurrentAP"),
                sort:sortInt,
                width: '115px',
                visible: this.isEmptyColumn((item)=>item.roundEffect?.increaseCurrentAP),
            },
            {
                id: i++,
                field: 'abilityEffect',
                label: 'abilityEffect',
                getValue: ({value, column}) => JSON.stringify(value),
                cellRenderer: OtherCell,
                width: '400px',
                visible: false,
            },
            {
                id: i++,
                field: 'fullRoundEffect',
                label: 'Full Round HP',
                getValue: ({value, column}) => ((value?.increaseCurrentHP?.min||0)+(value?.increaseCurrentHP?.max||0))/2,
                cellRenderer: RangeCell("fullRoundEffect","increaseCurrentHP"),
                sort:sortInt,
                width: '115px',
                visible: this.isEmptyColumn((item)=>item.fullRoundEffect?.increaseCurrentHP),
            },
            {
                id: i++,
                field: 'roundEffect',
                label: 'roundEffect',
                getValue: ({value, column}) => JSON.stringify(value),
                cellRenderer: OtherCell,
                width: '400px',
                visible: false,
            },

        ]
    }

    componentDidMount() {
        const height = document.getElementById(this.id).clientHeight;
        const top = document.getElementById(this.id).offsetTop;
        this.setState({ top, height });
    }

    render() {
        GridTable.defaultProps.isPaginated = false;
        GridTable.defaultProps.minColumnResizeWidth = 30;
        GridTable.defaultProps.isVirtualScroll = false;
        GridTable.defaultProps.showSearch = false;
        GridTable.defaultProps.showColumnVisibilityManager = false;

        this.rows = this.getRows();
        const columns = this.getColumns()

        return (<div id={this.id}>
                    <TableAbsHeader columns={columns} size={this.state}/>
                    <GridTable 
                        columns={columns} 
                        rows={this.rows} 
                        onLoad={hashLinkScroll} 
                        key={this.props.title}/>
                </div>)

    }
}

