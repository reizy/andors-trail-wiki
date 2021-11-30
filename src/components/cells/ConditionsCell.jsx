import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';

const styles = {
    root: {
        position: 'relative',
        padding: '5px 20px',
        display: 'flex',
        width: '100%',
        height: '100%',
    },
    text: {
        marginLeft: 1,
        whiteSpace: 'nowrap',

    },
    aimg: {
        width:32, 
        height:32, 
        overflow: 'hidden' 
    },
}

const getSrc = (id) => {
    const tmp = id?.split(":")
    return "/drawable/"+tmp[0]+".png";
}
const getTypePosition = (dt) => {
    switch(dt) {
        
        case 'legendary': return  "-128px 0px";
        case 'extraordinary': return  "-64px 0px";
        case 'rare': return  "-96px 0px";
        case 'quest': return  "-32px 0px";
        
        default: return "32px 0px";
    }
}
const getPosition = (id, width) => {
    const tmp = id?.split(":")[1]
    var x = - tmp % width * 32;
    var y = (- tmp * 32 - x) / width;
    return {x, y};
}
const getImgId = (id, rowIndex, index) => {
    return id+"_"+rowIndex+"_"+index;
}

const onImgLoad = (id, rowIndex, index) => {
    return ()=> {
        var img = document.getElementById(getImgId(id, rowIndex, index));
        var p = getPosition(id, img.width/32);
        img.style = `margin: ${p.y}px 0 0 ${p.x}px`;
    }
}

const showCondition = (prefix, rowIndex) => {
    return (row, index) => {
        var title = prefix;
        if (row.chance) title += row.chance +"% chance of ";
        title += row.link.name ;
        title += (row.magnitude >= 1)?(" x" + row.magnitude) : " clearing";
        if (row.duration) title += " (" + row.duration + " rounds)";
        const href = "/conditions#"+row.link.id;
        const id = getImgId(row.link.iconID, rowIndex, index);
        return <Link style={styles.aimg} title={title} to={href} key={id} >
                   <img id={id} src={getSrc(row.link.iconID)} 
                        onLoad={onImgLoad(row.link.iconID, rowIndex, index)}
                   />
               </Link>
    }
}
const getRowsData = (prefix, values, rowIndex) => {
    return values?.map(showCondition(prefix, rowIndex));
}
const getTextData = (prefix, value, text, rowIndex) => {
    if (!value) return "";
    return <span style={styles.text} title={prefix + " " + value.min + "-" + value.max}>{text}</span>;
}

const ConditionsCell = ({tableManager, value, onChange, isEdit, data, column, rowIndex, searchText, isFirstEditableCell}) => {

    return (
        <div style={styles.root}>
            {
                <React.Fragment>
                    {getRowsData("On equip\n ", data.equipEffect?.addedConditions, rowIndex)}
                    {getRowsData("On hit\n On target\n  ", data.hitEffect?.conditionsTarget, rowIndex)}
                    {getRowsData("On hit\n On source\n  ", data.hitEffect?.conditionsSource, rowIndex)}
                    {getTextData("On hit\n On source\n  ", data.hitEffect?.increaseCurrentHP, "+HP", rowIndex)}
                    {getRowsData("On kill\n On source\n  ", data.killEffect?.conditionsSource, rowIndex)}
                    {getTextData("On kill\n On source\n  ", data.killEffect?.increaseCurrentHP, "+HP", rowIndex)}
                    {getTextData("On kill\n On source\n  ", data.killEffect?.increaseCurrentAP, "+AP", rowIndex)}
                    {getRowsData("On hit received\n On source\n  ", data.hitReceivedEffect?.conditionsSource, rowIndex)}
                    {getRowsData("On hit received\n On target\n  ", data.hitReceivedEffect?.conditionsTarget, rowIndex)}
                    {getRowsData("On use\n ", data.useEffect?.conditionsSource, rowIndex)}
                </React.Fragment>
            }
        </div>
    )
}

export default ConditionsCell;