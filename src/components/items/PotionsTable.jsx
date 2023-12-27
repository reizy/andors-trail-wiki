import React, { Component } from 'react';
import GridTable from '@nadavshaar/react-grid-table';
import '../../@nadavshaar/react-grid-table/dist/index.css';
import IconCell from "../cells/IconCell";
import ConditionsCell from "../cells/ConditionsCell";
import OtherCell from "../cells/OtherCell";
import RangeCell from "../cells/RangeCell";
import NameCell from "./NameCell";
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
        this.id="PotionTable" + Math.random();
    }

    getRows  = function () {
        var data = this.props.data;
        if (this.props.filter) {
            data = data.filter((e)=>this.props.filter(e));
        }
        return data;
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
                field: 'categoryLink',
                label: 'Category',
                getValue: ({value, column}) => value.name,
                width: '140px',
            },
            {
                id: i++,
                field: 'useEffect',
                label: 'HP',
                getValue: ({value, column}) => ((value?.increaseCurrentHP?.min||0) + (value?.increaseCurrentHP?.max||0))/2,
                sort:sortInt,
                width: '130px',
                cellRenderer: RangeCell("useEffect", "increaseCurrentHP"),
            },
            {
                id: i++,
                field: 'conditionsCount',
                label: 'Conditions',
                sort:sortInt,
                width: '250px',
                cellRenderer: ConditionsCell,
            },
            {
                id: i++,
                field: 'priceCost',
                label: 'Price',
                getValue: ({value, column}) => value ? value + " gold" : "",
                sort:sortInt,
                width: '100px',
                visible: true,
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
                        onLoad={hashLinkScroll}/>
                </div>)
    }
}

