const calculateExp = (o) => {
    const EXP_FACTOR_DAMAGERESISTANCE = 9;
    const EXP_FACTOR_SCALING = 0.7;

    const {
        attackCost,
        attackChance,
        attackDamage,
        criticalSkill,
        criticalMultiplier,
        blockChance,
        damageResistance,
        hitEffect,
        maxHP,
        maxAP
    } = o;

    const averageDamage = attackDamage ? ((attackDamage.min + attackDamage.max) / 2) : 0;
    const avgAttackHP = getAttacksPerTurn(maxAP, attackCost) * div100(attackChance) * averageDamage * (1 + div100(criticalSkill) * (criticalMultiplier||0));
    const avgDefenseHP = maxHP * (1 + div100(blockChance)) + EXP_FACTOR_DAMAGERESISTANCE * (damageResistance||0);
    var attackConditionBonus = 0;
    if (hitEffect?.conditionsTarget?.length) {
        attackConditionBonus += 50;
    }

    const result = Math.ceil((avgAttackHP * 3 + avgDefenseHP) * EXP_FACTOR_SCALING) + attackConditionBonus;
    return result;
}
function div100(v = 0) {
    return v / 100;
}
function getAttacksPerTurn(maxAP = 10, attackCost) {
    return Math.floor(maxAP / attackCost);
}

export default calculateExp;
