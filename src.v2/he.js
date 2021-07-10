let exp = 0
let money = 0
let common = [0, 0]
let uncommon = [0, 0]
let rare = [0, 0]
let epic = [0, 0]
let legendary = [0, 0]

function roll() {
    const a = Math.floor(Math.random() * 100)
    const b = Math.floor(Math.random() * 5)
    if (b === 0) {
        if (a < 3) {
            if (Math.floor(Math.random() * 10000) === 5) {
                legendary[Math.floor(Math.random() * 2)] +=1;
            } else {
                epic[Math.floor(Math.random() * 2)] +=1;
            }
        } else {
            exp += 10;
        }
    } else if (b === 1) {
        if (a > 90) {
            rare[Math.floor(Math.random() * 2)] +=1;
        } else {
            exp += 10;
        }
    } else if (b === 2) {
        if (a > 80) {
            uncommon[Math.floor(Math.random() * 2)] +=1;
        } else {
            exp += 10;
        }
    } else if (b === 3) {
        if (a > 60) {
            common[Math.floor(Math.random() * 2)] +=1;
        } else {
            money += 10;
        }
    } else {
        if (a > 60) {
            exp += 30;
        } else {
            money += 10;
        }
    }
}

function pack() {
    roll()
    roll()
    roll()
}

const gift = 3;
const rollPerDay = 6;
const days = 30 * 12 * 100000;
const packs = gift * rollPerDay * days;
for (let i = 0; i < packs; i++) {
    pack()
}

const packPrice = 99
const price = packs * packPrice

console.log('packs: ' + packs)
console.log('price: ' + price)
console.log('exp: ' + exp)
console.log('money: ' + money)
console.log('part: ' + Math.floor(money / (packs * packPrice) * 100 * 10) / 10 + '%')
console.log('common: ' + common.join(' <> '))
console.log('uncommon: ' + uncommon.join(' <> '))
console.log('rare: ' + rare.join(' <> '))
console.log('epic: ' + epic.join(' <> '))
console.log('legendary: ' + legendary.join(' <> '))

console.log('')
const wantedPrice = price * 0.75
console.log('wanted price: ' + wantedPrice)

const mulZat = 2
const rareMul = [
    1,
    4,
    6,
    10,
]
const rareName = [
    'common',
    'uncommon',
    'rare',
    'epic',
    'legendary'
]

const objects = [
    common,
    uncommon,
    rare,
    epic,
]

const allObjects = objects.reduce((sum, [p1, p2]) => {
    return sum + p1 + p2
}, 0)
console.log('allObjects: ' + allObjects)

const per = (val, all) => Math.floor((val / all) * 100 * 10) / 10
const percents = objects.map(([p1, p2]) => {
    return [per(p1, allObjects), per(p2, allObjects)]
}, 0)
percents.forEach(([p1, p2], index) => {
    console.log(`${rareName[index]} part: ${p1}% <> ${p2}% (${p1 + p2}%)`)
})
console.log(`${rareName[4]} part: ${(legendary[0] / allObjects) * 100}% <> ${(legendary[1] / allObjects) * 100}% ()`)
const lul = wantedPrice / 100
const avgPrice = (obj, index, zat) => Math.floor((percents[3 - index][zat] * lul) / obj * 1000) / 1000
let sumAvgPrices = 0
const basePrices = []
let step = 0
objects.forEach(([p1, p2], index) => {
    const pv1 = avgPrice(p1, index, 0) * 0.9
    const pv2 = avgPrice(p1, index, 0) * 1.1
    const pvs = pv1 + pv2
    step = pv2 / pv1
    basePrices.push(pv1)
    sumAvgPrices += pv1 * objects[index][0] + pv2 * objects[index][1]
    console.log(`${rareName[index]} avg price: ${pv1} <> ${pv2} (${pvs})`)
})
console.log(`step: ${step}`)
console.log(`sumAvgPrices: ${sumAvgPrices}`)
console.log('wanted price: ' + wantedPrice)
console.log()
const { printTable } = require('console-table-printer');
const table = [
]
basePrices.push(basePrices[basePrices.length - 1] * 6.08)
basePrices.forEach((base, index) => {
    let curPrice = base
    const vals = {
        rarity: rareName[index]
    }
    for (let i = 1; i < 11; i++) {
        vals['+' + i] = Math.floor(curPrice)
        curPrice *= step
    }
    table.push(vals)
})
printTable(table)

console.log()

let sum = 0
objects.forEach(([p1, p2], index) => {
    const prices = [p1 * rareMul[index] * mulZat, p2 * rareMul[index] * mulZat]
    sum += prices[0] + prices[1];
    console.log(rareName[index] + ': ' + p1 + ' <> ' + p2)
})
console.log('sum: ' + sum)
console.log('mon + sum: ' + (sum + money))


