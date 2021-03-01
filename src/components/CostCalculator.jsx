const calculateCost = (o, isWeapon) => {
    if (o.hasManualPrice) return o.baseMarketCost;
    const costEquipStats = calculateCostEquipEffect(o.equipEffect, isWeapon);
    const costUse =calculateUseCost(o.useEffect);
    const costHit = calculateHitCost(o.hitEffect);
    const costKill = calculateKillCost(o.killEffect);
    return Math.max(1, costEquipStats + costUse + costHit + costKill);
}
const calculateCostEquipEffect = (o, isWeapon) => {
        if (!o) return 0;
        const {
            increaseBlockChance ,increaseAttackChance, 
            increaseAttackCost, increaseDamageResistance, 
            increaseAttackDamage,
            increaseCriticalSkill, setCriticalMultiplier,
            increaseMaxHP, increaseMaxAP,
            increaseMoveCost, increaseUseItemCost, increaseReequipCost
        } = o;
        const costBC = (3*Math.pow(Math.max(0, increaseBlockChance), 2.5) + 28*increaseBlockChance);
        const costAC = (0.4*Math.pow(Math.max(0,increaseAttackChance), 2.5) - 6*Math.pow(Math.abs(Math.min(0,increaseAttackChance)),2.7));

        const costAP = isWeapon ?
                (0.2*Math.pow(10.0/increaseAttackCost, 8) - 25*increaseAttackCost)
                :-3125 * increaseAttackCost;
        const costDR = 1325 * increaseDamageResistance;
        const costDMG_Min = isWeapon ?
                (10*Math.pow(Math.max(0, increaseAttackDamage?.min), 2.5))
                : (10*Math.pow(Math.max(0, increaseAttackDamage?.min), 3) + increaseAttackDamage?.min*80);
        const costDMG_Max = isWeapon ?
                (2*Math.pow(Math.max(0, increaseAttackDamage?.max), 2.1))
                : (2*Math.pow(Math.max(0, increaseAttackDamage?.max), 3) + increaseAttackDamage?.max*20);
        const costCS = (2.2*Math.pow(increaseCriticalSkill, 3));
        const costCM = (50*Math.pow(Math.max(0, setCriticalMultiplier), 2));

        const costMaxHP = (30*Math.pow(Math.max(0,increaseMaxHP), 1.2) + 70*increaseMaxHP);
        const costMaxAP = (50*Math.pow(Math.max(0,increaseMaxAP), 3) + 750*increaseMaxAP);
        const costMovement = (510*Math.pow(Math.max(0,-increaseMoveCost), 2.5) - 350*increaseMoveCost);
        const costUseItem = (915*Math.pow(Math.max(0,-increaseUseItemCost), 3) - 430*increaseUseItemCost);
        const costReequip = (450*Math.pow(Math.max(0,-increaseReequipCost), 2) - 250*increaseReequipCost);

        return [costBC , costAC , costAP , costDR , costDMG_Min , costDMG_Max , costCS , costCM
                , costMaxHP , costMaxAP
                , costMovement , costUseItem , costReequip].reduce((a, b) => Math.trunc(a||0) + Math.trunc(b||0), 0);
}

const calculateUseCost = (o) => {
    if (!o) return 0;
    const averageHPBoost = averagef(o.increaseCurrentHP);
    if (averageHPBoost == 0) return 0;
    const costBoostHP = 0.1*signum(averageHPBoost)*Math.pow(Math.abs(averageHPBoost), 2) + 3*averageHPBoost;
    return Math.trunc(costBoostHP);
}
const signum = (e) => {
    if (e > 0) return 1;
    if (e < 0) return -1;
    return 0;
}
const averagef = (o) => {
    return ((o?.max||0) + (o?.min||0))/2;
}
const calculatePointsCost = (o, hpBase, apBase) => {
    if (!o) return 0;
    const averageHPBoost = averagef(o.increaseCurrentHP);
    const averageAPBoost = averagef(o.increaseCurrentAP);
    if (averageHPBoost == 0 && averageAPBoost == 0) return 0;

    const costBoostHP = (hpBase*Math.pow(Math.max(0,averageHPBoost), 2.5) + 450*averageHPBoost);
    const costBoostAP = (apBase*Math.pow(Math.max(0,averageAPBoost), 2.5) + 300*averageAPBoost);
    return Math.trunc(costBoostHP) + Math.trunc(costBoostAP);
}

const calculateHitCost = (o) => {
    return calculatePointsCost(o, 2770, 3100);
}

const calculateKillCost = (o) => {
    return calculatePointsCost(o, 923, 1033);
}

export default calculateCost;