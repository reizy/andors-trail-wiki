import React, { Component } from 'react';
import GridTable from '@nadavshaar/react-grid-table';
import '../../@nadavshaar/react-grid-table/dist/index.css';
import debug from '../../utils/debug'
import IconCell from "../cells/IconCell"
import { getDimentionById } from "../Icon"
import ConditionsCell from "../cells/ConditionsCell"
import OtherCell from "../cells/OtherCell"
import RangeCell from "../cells/RangeCell"
import NameCell from "./NameCell"
import TableAbsHeader from "../TableAbsHeader";

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
        this.id="MonsterTable" + Math.random();
    }

    getRows  = function () {
        var data = this.props.data;

        if (this.props.filter) {
            data = data.filter((e)=>this.props.filter(e));
        }
        return data;
    }

    maxIconWidth = function () {
        const width = this.rows.map((e) => getDimentionById(e.iconID).x).reduce((a, b) => Math.max(a, b), 32)+10;
        return width+"px";
    }

    getColumns  = function () {
        var i = 1;
        return [
            {
                id: i++,
                field: 'unique',
                label: '',
                pinned: true,
                cellRenderer: IconCell,
                sort:sortInt,
                width: this.maxIconWidth(),
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
                field: 'maxHP',
                label: 'HP',
                sort:sortInt,
                width: '50px',
            },
            {
                id: i++,
                field: 'attackChance',
                label: 'AC',
                sort:sortInt,
                width: '50px',
            },
            {
                id: i++,
                field: 'attackDamage',
                label: 'Dmg',
                getValue: ({value, column}) => ((value?.min||0) + (value?.max||0))/2,
                sort:sortInt,
                cellRenderer: RangeCell("attackDamage"),
                width: '120px',
            },
            {
                id: i++,
                field: 'criticalSkill',
                label: 'Crit',
                sort:sortInt,
                width: '60px',
            },
            {
                id: i++,
                field: 'criticalMultiplier',
                label: 'Crit*',
                sort:sortInt,
                width: '55px',
            },
            {
                id: i++,
                field: 'blockChance',
                label: 'BC',
                sort:sortInt,
                width: '50px',
            },
            {
                id: i++,
                field: 'damageResistance',
                label: 'Res',
                sort:sortInt,
                width: '50px',
            },
            {
                id: i++,
                field: 'maxAP',
                label: 'AP',
                sort:sortInt,
                width: '50px',
            },
            {
                id: i++,
                field: 'attackCost',
                label: 'Atk Cost',
                sort:sortInt,
                width: '85px',
            },
            {
                id: i++,
                field: 'moveCost',
                label: 'Move Cost',
                sort:sortInt,
                width: '100px',
            },
            {
                id: i++,
                field: 'exp',
                label: 'XP',
                sort:sortInt,
                width: '75px',
            },
            {
                id: i++,
                field: 'conditionsCount',
                label: 'Conditions',
                sort:sortInt,
                width: '130px',
                cellRenderer: ConditionsCell,
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

