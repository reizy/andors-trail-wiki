import React from 'react';

const styles = {
    root: {
        position: 'relative',
        padding: '0 20px',
        display: 'flex',
        width: '100%',
        alignItems: 'center'
    },
    img: {
        width: 32,
        height:32,
    },
}


const Cell = ({tableManager, value, onChange, isEdit, data, column, rowIndex, searchText, isFirstEditableCell}) => {
    return (
        <div style={styles.root}>
            {value && <img style={styles.img} src="/image/yes.png"/>}
        </div>
    )
}

export default Cell;