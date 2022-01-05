import React from 'react';
import LinksTable from './LinksTable';

const styles = {
    text: {
        marginLeft: 10,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    table: {
        paddingTop: 10,
        marginLeft: -10,
    },
}

export default class ExpandingName extends React.Component {

    constructor(props) {
        super(props);
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
        const links = data.links;
        if (!links||!links.length) {
            return (
              <React.Fragment>
                    <div style={{ display:'flex'}} >
                        <div style={{ width: 19}} />
                        <span style={styles.text}>{value}</span>
                    </div>
              </React.Fragment> );
        }
        return (
              <React.Fragment>
                    <div style={{ display:'flex'}} onClick={this.toggleExpand}>
                            <img src="../image/sort_desc.png" />
                            <span style={styles.text}>{value}</span>
                    </div>
                    <div style={styles.table}>
                        {(this.state.expanded) && <LinksTable data={links}/>}
                    </div>

             </React.Fragment> );
    }
}
