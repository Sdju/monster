const check =  x => {
    let c = 0
    for (let i = 1; i <= x; i++) {
        if (x % i === 0) {
            c += 1
        }
    }
    return c
}
let x = 0
let dx;
let cx;
do{
    x++
    dx = x ** 2
    cx = check(dx)
    console.log(`${dx} -> ${cx}`)
} while (cx !== 17)

const a = []
for (let i = 1; i <= dx; i++) {
    if (dx % i === 0) {
        a.push(i)
    }
}
console.log(`${dx} : ${a.join()}`)
