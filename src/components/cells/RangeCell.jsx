import React from 'react';

const styles = {
    root: {
        position: 'relative',
        padding: '10px 20px',
        display: 'block',
        width: '100%',
        height: '100%',
        alignItems: 'center'
    },
    text: {
        margin: 'auto',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    

}
const RangeCell = (...field)=>{
    return ({tableManager, value, onChange, isEdit, data, column, rowIndex, searchText, isFirstEditableCell}) => {
        var range = {data};
        field.forEach((f)=>{range.data = range.data[f]||{}});
        if (value == "0") return "";
        if (range.data.min == range.data.max) return (<div style={styles.root}><span style={styles.text}>{value}</span></div>);
        return (
            <div style={styles.root}>
               <span style={styles.text}>{value}({range.data.min}/{range.data.max})</span>
            </div>
        )

    }
}

export default RangeCell;