import React from 'react';

const styles = {
    root: {
        position: 'relative',
        padding: '0 20px',
        display: 'flex',
        width: '100%',
        height: '100%',
        alignItems: 'center'
    },
    text: {
        marginLeft: 10,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
}

const knownEquipEffects = [
                  "increaseAttackDamage",
                  "increaseAttackCost",
                  "increaseAttackChance",
                  "increaseBlockChance",
                  "increaseCriticalSkill",
                  "setCriticalMultiplier",
                  "increaseMaxHP",
                  "setNonWeaponDamageModifier",
                  "increaseMaxAP",
                  "increaseDamageResistance",
                  "addedConditions",
                  "conditionsTarget",
                  "increaseMoveCost",
                  "increaseUseItemCost",
                  "increaseReequipCost",
                  "",
                  "",
              ];
const knownHitEffects = [
                  "conditionsTarget",
                  "conditionsSource",
                  "increaseCurrentHP",
                  "",
                  "",
              ];
const knownKillEffects = [
                  "conditionsSource",
                  "increaseCurrentHP",
                  "increaseCurrentAP",
                  "",
              ];
const knownReceivedEffects = [
                  "conditionsSource",
                  "conditionsTarget",
                  "",
                  "",
              ];
const knownUseEffects = [
                  "conditionsSource",
                  "increaseCurrentHP",
                  "",
              ];
const knownAbilityEffects = [
                  "increaseAttackChance",
                  "increaseBlockChance",
                  "increaseDamageResistance",
                  "increaseAttackDamage",
                  "increaseMaxAP",
                  "increaseMoveCost",
                  "increaseAttackCost",
                  "increaseMaxHP",
                  "increaseCriticalSkill",
                  "increaseUseItemCost",
                  "increaseReequipCost",
                  "visualEffectID",
                  "",
              ];
const knownRoundEffects = [
                  "increaseCurrentHP",
                  "visualEffectID",
                  "increaseCurrentAP",
                  "",
                  "",
                  "",
              ];

const getOther = (prefix, equipEffect, f) => {
    if (!equipEffect) return "";
    const result = Object.keys(equipEffect)
        .filter((e)=> f.indexOf(e)==-1)
        .map((key) => [key, equipEffect[key]]);
    return (result.length>0) ? prefix + JSON.stringify(result) : "";
}







const OtherCell = ({tableManager, value, onChange, isEdit, data, column, rowIndex, searchText, isFirstEditableCell}) => {

    return (
        <div style={styles.root}>
            {
                <React.Fragment>
                    {getOther("On equip:", data.equipEffect, knownEquipEffects)}
                    {getOther("On hit:", data.hitEffect, knownHitEffects)}
                    {getOther("On get hit:", data.hitReceivedEffect, knownReceivedEffects)}
                    {getOther("On kill: ", data.killEffect, knownKillEffects)}
                    {getOther("On use: ", data.useEffect, knownUseEffects)}
                    {getOther("", data.abilityEffect, knownAbilityEffects)}
                    {getOther("", data.roundEffect, knownRoundEffects)}
                </React.Fragment>
            }
        </div>
    )
}

export default OtherCell;