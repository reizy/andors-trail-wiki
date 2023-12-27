import React, { Component } from 'react';
import GridTable from '@nadavshaar/react-grid-table';
import '../../@nadavshaar/react-grid-table/dist/index.css';
import IconCell from "../cells/IconCell";
import ConditionsCell from "../cells/ConditionsCell";
import OtherCell from "../cells/OtherCell";
import RangeCell from "../cells/RangeCell";
import TableAbsHeader from "../TableAbsHeader";
import NameCell from "./NameCell";

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
const sortDT = ({a, b, isAscending}) => {
    const list = ["ordinary","quest","rare","extraordinary","legendary",""];
    let aa = list.indexOf(a);
    let bb = list.indexOf(b);
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
        this.id="ItemTable" + Math.random();
    }

    getRows  = function () {
        var data = this.props.data;
        if (this.props.filter) {
            data = data.filter((e)=>this.props.filter(e));
        }
        return data;
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
                sort:sortDT,
                width: '50px',
            },
            {
                id: i++,
                field: 'name',
                label: 'Name',
                pinned: true,
                cellRenderer: NameCell,
                width: '290px',
            },
            {
                id: i++,
                field: 'equipEffect',
                label: 'Atk Cost',
                getValue: ({value, column}) => value?.increaseAttackCost,
                sort:sortInt,
                width: '85px',
                visible: this.isEmptyColumn((item)=>item.equipEffect?.increaseAttackCost),
            },
            {
                id: i++,
                field: 'equipEffect',
                label: 'Dmg',
                getValue: ({value, column}) => ((value?.increaseAttackDamage?.min||0) + (value?.increaseAttackDamage?.max||0))/2,
                sort:sortInt,
                cellRenderer: RangeCell("equipEffect", "increaseAttackDamage"),
                width: '120px',
                visible: this.isEmptyColumn((item)=>item.equipEffect?.increaseAttackDamage),
            },
            {
                id: i++,
                field: 'equipEffect',
                label: 'AC',
                getValue: ({value, column}) => value?.increaseAttackChance,
                sort:sortInt,
                width: '50px',
                visible: this.isEmptyColumn((item)=>item.equipEffect?.increaseAttackChance),
            },
            {
                id: i++,
                field: 'equipEffect',
                label: 'BC',
                getValue: ({value, column}) => value?.increaseBlockChance,
                sort:sortInt,
                width: '50px',
                visible: this.isEmptyColumn((item)=>item.equipEffect?.increaseBlockChance),
            },
            {
                id: i++,
                field: 'equipEffect',
                label: 'Crit',
                getValue: ({value, column}) => value?.increaseCriticalSkill,
                sort:sortInt,
                width: '60px',
                visible: this.isEmptyColumn((item)=>item.equipEffect?.increaseCriticalSkill),
            },
            {
                id: i++,
                field: 'equipEffect',
                label: 'Crit*',
                getValue: ({value, column}) => value?.setCriticalMultiplier,
                sort:sortInt,
                width: '55px',
                visible: this.isEmptyColumn((item)=>item.equipEffect?.setCriticalMultiplier),
            },
            {
                id: i++,
                field: 'equipEffect',
                label: 'MaxHP',
                getValue: ({value, column}) => value?.increaseMaxHP,
                sort:sortInt,
                width: '75px',
                visible: this.isEmptyColumn((item)=>item.equipEffect?.increaseMaxHP),
            },
            {
                id: i++,
                field: 'equipEffect',
                label: 'MaxAP',
                getValue: ({value, column}) => value?.increaseMaxAP,
                sort:sortInt,
                width: '75px',
                visible: this.isEmptyColumn((item)=>item.equipEffect?.increaseMaxAP),
            },
            {
                id: i++,
                field: 'equipEffect',
                label: 'MC',
                getValue: ({value, column}) => value?.increaseMoveCost,
                sort:sortInt,
                width: '80px',
                visible: this.isEmptyColumn((item)=>item.equipEffect?.increaseMoveCost),
            },
            {
                id: i++,
                field: 'equipEffect',
                label: 'UC',
                getValue: ({value, column}) => value?.increaseUseItemCost,
                sort:sortInt,
                width: '50px',
                visible: this.isEmptyColumn((item)=>item.equipEffect?.increaseUseItemCost),
            },
            {
                id: i++,
                field: 'equipEffect',
                label: 'EC',
                getValue: ({value, column}) => value?.increaseReequipCost,
                sort:sortInt,
                width: '50px',
                visible: this.isEmptyColumn((item)=>item.equipEffect?.increaseReequipCost),
            },
            {
                id: i++,
                field: 'equipEffect',
                label: 'Dmg*%',
                getValue: ({value, column}) => value?.setNonWeaponDamageModifier||100,
                sort:sortInt,
                width: '75px',
                visible: this.isEmptyColumn((item)=>item.equipEffect?.setNonWeaponDamageModifier),
            },
            {
                id: i++,
                field: 'equipEffect',
                label: 'Res',
                getValue: ({value, column}) => value?.increaseDamageResistance,
                sort:sortInt,
                width: '50px',
                visible: this.isEmptyColumn((item)=>item.equipEffect?.increaseDamageResistance),
            },
            {
                id: i++,
                field: 'conditionsCount',
                label: 'Conditions',
                sort:sortInt,
                width: '140px',
                cellRenderer: ConditionsCell,
            },
            {
                id: i++,
                field: 'priceCost',
                label: 'Price',
                sort:sortInt,
                width: '60px',
                visible: true,
            },
            {
                id: i++,
                field: 'categoryLink',
                label: 'Category',
                getValue: ({value, column}) => value?.name,
                width: '180px',
            },
            {
                id: i++,
                field: 'equipEffect',
                label: 'Other',
                getValue: ({value, column}) => value,
                width: '100px',
                sort:sortStr,
                cellRenderer: OtherCell,
                visible: false,
            },
        ]
    }

    componentDidMount() {
        const top = document.getElementById(this.id).offsetTop;
        this.setState({ top, height: 999999 });
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

