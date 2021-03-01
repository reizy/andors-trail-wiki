import React from 'react';
import ExpandingName from './ExpandingName';

const styles = {
    root: {
        position: 'relative',
        padding: '10px',
        display: 'block',
        width: '100%',
        height: '100%',
        alignItems: 'center'
    },
}

const IconCell = ({tableManager, value, onChange, isEdit, data, column, rowIndex, searchText, isFirstEditableCell}) => {
    return (
        <div style={styles.root}>
            <ExpandingName data={data} value={value}/>
        </div>
    )
}

export default IconCell;