import React, { Component } from 'react';
import GridTable from '@nadavshaar/react-grid-table';
import '../../@nadavshaar/react-grid-table/dist/index.css';
import IconCell from "../cells/IconCell"
import NameCell from "./NameCell"
import LocationCell from "./LocationCell"

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
        this.getColumns = this.getColumns.bind(this);
        this.getRows = this.getRows.bind(this);
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
                field: 'unique',
                label: '',
                pinned: true,
                cellRenderer: IconCell,
                sort:sortInt,
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
                field: 'spawnGroupLinks',
                label: 'Locations',
                sort: sortLocations,
                cellRenderer: LocationCell,
                width: '300px',
            },
         
        ]
    }

    render() {
        GridTable.defaultProps.isPaginated = false;
        GridTable.defaultProps.minColumnResizeWidth = 30;
        GridTable.defaultProps.isVirtualScroll = false;
        GridTable.defaultProps.showSearch = false;
        GridTable.defaultProps.showColumnVisibilityManager = false;

        return <GridTable 
                    columns={this.getColumns()}
                    rows={this.getRows()}
                    onLoad={hashLinkScroll}/>;
    }
}

