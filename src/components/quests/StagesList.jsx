import React, { Component } from 'react';
import Icon from '../Icon';

const styles = {
    root: {
        marginLeft: 50,
        width: 1000,
        textAlign: 'left',
    },

}

export default class Table extends React.Component {

    constructor(props) {
        super(props);
    }

    getRowsData = function () {
        var data = this.props.data;
        if (!data) return "";

        return data.sort((a,b) => (a.progress-b.progress)).map((row, index) => {
            const className = (!!row.finishesQuest)?"end":(!!row.rewardExperience)?"exp":undefined;
            return <li className={className} key={index}>
                        {row.logText} 
                        {!!row.rewardExperience&&<b> ({row.rewardExperience}XP)</b>} 
                        {!!row.finishesQuest&&<b>[End of quest]</b>} 
                   </li>
        })
    }

    render() {
        return <ul style={styles.root}>{this.getRowsData()}</ul>;
    }
}
