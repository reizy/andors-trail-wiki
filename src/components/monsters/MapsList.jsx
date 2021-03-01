import React, { Component } from 'react';
import { HashLink as Link } from 'react-router-hash-link';


const styles = {
    root: {
        width: 1000,
    },
    img: {
        width: 32,
        height:32,
        marginTop: -5,
        marginRight: 5,
    },
    link: {
        color: 'white',
        textTransform: 'capitalize',
        float:'left',
        display: 'flex',
        margin: 10,
    }
}

export default class Table extends React.Component {

    constructor(props) {
        super(props);
        this.getRowsData = this.getRowsData.bind(this);
    }

    getRowsData = function (data) {
        if (!data) return "";
        const maps = data?.flatMap((e)=>e.maps)?.filter(unique);

        return maps?.map((row, index)=>{
            return <Link key={index} to={row.rootLink + row.name + "#" + data[0].key} style={styles.link}>
                        <img style={styles.img} src="/image/ui_icon_map.png"  />{row.name}
                   </Link>
        })
    }

    render() {

        return (
            <div style={styles.root}>{this.getRowsData(this.props.data)}</div>
        );
    }
}
function unique(item, pos, self) {
    return self.indexOf(item) == pos;
}