const csvWriter = require('csv-write-stream')
const tda = require('tda-api-client');
const fs = require('fs');



let getValue = async () => {
    let accounts = await tda.accounts.getAccounts({ fields: "positions" })
    let totalValue = 0;
    totalValue += await accounts[0]['securitiesAccount']['currentBalances']['liquidationValue'];
    totalValue += await accounts[1]['securitiesAccount']['currentBalances']['liquidationValue'];
    writeValue(totalValue);
}

let getPositions = async () => {
    let rawPositions = await tda.accounts.getAccounts({ fields: "positions" })
    let positions = rawPositions[0]['securitiesAccount']['positions'];
    positions.concat(rawPositions[0]['securitiesAccount']['positions'])
    positions.forEach(async p => {
        await positions.push(p);
    })
    writePositions(positions)
}

let writePositions = (positions) => {
    let writer = csvWriter({ sendHeaders: false })
    writer.pipe(fs.createWriteStream('data/positions.csv', { "flags": 'a' }));
    
    for (let p of positions) {
        let obj = {
            time: new Date().getTime(), 
            ticker: p['instrument']['symbol'],
            avgPrice: p['averagePrice'],
            shares: p['longQuantity'],
            value: p['marketValue']
        }
        writer.write(obj)
    }
    writer.end()
    console.log('DONE WRITING POSITIONS')
}

let writeValue = (accVal) => {
    var writer = csvWriter({ sendHeaders: false })
    writer.pipe(fs.createWriteStream('data/value.csv', { "flags": 'a' }));
    writer.write({ time: new Date().getTime(), value: accVal })
    writer.end()
    console.log('DONE WRITING VALUES')
}


console.log(new Date());
console.log("GETTING TD AMERATRADE DATA")

getValue();
getPositions();