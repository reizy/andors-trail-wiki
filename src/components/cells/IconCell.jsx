import React from 'react';
import Icon from '../Icon';

const styles = {
    root: {
        position: 'relative',
        paddingLeft: '10px',
        paddingTop: '5px',
        display: 'block',
        width: '100%',
        height: '100%',
        alignItems: 'center'
    },

}

const IconCell = ({tableManager, value, onChange, isEdit, data, column, rowIndex, searchText, isFirstEditableCell}) => {
    return (
        <div style={styles.root}>
            <Icon data={data} />
        </div>
    )
}

export default IconCell;