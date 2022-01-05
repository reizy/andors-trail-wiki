import React, { Component } from 'react';
import { HashLink as Link } from 'react-router-hash-link';

function unique(item, pos, self) {
    return self.indexOf(item) == pos;
}

const getRowsData = function (data) {
        if (!data) return "";
        const maps = data?.flatMap((e) => e.maps)?.filter(unique);
        return maps?.map((row, index) => {
            const href = row.rootLink + row.name + "#" + data[0].key;
            return <Link key={index} to={href} className="npc-location-cell">{row.name}</Link>;
        })
    }

const Cell = ({tableManager, value, onChange, isEdit, data, column, rowIndex, searchText, isFirstEditableCell}) => {
    return <div>{getRowsData(data.spawnGroupLinks)}</div>;
}

export default Cell;