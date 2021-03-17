import React, { Component } from 'react';
import GridTable from '@nadavshaar/react-grid-table';
import '../../@nadavshaar/react-grid-table/dist/index.css';
import IconCell from "../cells/IconCell"
import { getDimentionById } from "../Icon"
import NameCell from "./NameCell"
import LocationCell from "./LocationCell"
import TableAbsHeader from "../TableAbsHeader";

const sortLocations = ({a, b, isAscending}) => {
    let aa = (a[0]?.maps&&a[0].maps[0]?.name)||"";
    let bb = (b[0]?.maps&&b[0].maps[0]?.name)||"";
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
        this.id="NpcTable" + Math.random();
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
                field: 'spawnGroupLinks',
                label: 'Locations',
                sort: sortLocations,
                cellRenderer: LocationCell,
                width: '300px',
            },
            {
                id: i++,
                field: 'questLinks',
                label: 'questLinks',
                getValue: ({value, column}) => value?.length,
                width: '300px',
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

