import React, { Component } from 'react';
import GridTable from '@nadavshaar/react-grid-table';
import '../../@nadavshaar/react-grid-table/dist/index.css';
import NameCell from "./NameCell";
import TableAbsHeader from "../TableAbsHeader";
import { HashLink as Link } from 'react-router-hash-link';

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
                field: 'id',
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
                width: '300px',
            },
            {
                id: i++,
                field: 'stages',
                label: 'Text',
                width: '800px',
                getValue: ({value, column}) => value[0]?.logText,
                cellRenderer: TextCell,
                sort:sortStr,
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

const IconCell = ({tableManager, value, onChange, isEdit, data, column, rowIndex, searchText, isFirstEditableCell}) => {
    const href = (data.rootLink) + data.id;
    return <Link to={href}>
               <div id={value} className="TableAncor"/>
               <img style={{paddingLeft: 1, paddingTop: 5}} src="/image/ui_icon_quest.png"/>
           </Link>
}
const TextCell = ({tableManager, value, onChange, isEdit, data, column, rowIndex, searchText, isFirstEditableCell}) => {
    const text = {
        textAlign: 'left',
        marginLeft: 10,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    }
    return <p style={text}>{value}</p>
}


