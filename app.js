const csvWriter = require('csv-write-stream')
const tda = require('tda-api-client');
const fs = require('fs');

let getValue = async () => {
    let accounts = await tda.accounts.getAccounts({ fields: "positions" });
    let totalValue = 0;
    totalValue += await accounts[0]['securitiesAccount']['currentBalances']['liquidationValue'];
    totalValue += await accounts[1]['securitiesAccount']['currentBalances']['liquidationValue'];
    // console.log(totalValue);
    writeValue(totalValue);
}

let getPositions = async () => {
    let rawPositions = await tda.accounts.getAccounts({ fields: "positions" }) // returns arr of securitiesAccount objs
    let accumulator = {} // keys are ticker val is obj with keys marketValue shares and avgPrice
    rawPositions[0]['securitiesAccount']['positions'].forEach(p => { // for each position in first account
        console.log(p['instrument']['symbol'])
        console.log('added ticker')
        console.log(p['averagePrice'])
        accumulator[p['instrument']['symbol']] = {
            'marketValue': p['marketValue'],
            'shares': p['longQuantity'],
            'averagePrice': p['averagePrice']
        }
    })

    
    console.log(accumulator)
    
    rawPositions[1]['securitiesAccount']['positions'].forEach(p => {
        if (Object.keys(accumulator).includes(p['instrument']['symbol'])) {
            console.log(p['instrument']['symbol'])
            console.log('updated ticker')
            // console.log(accumulator)
            let numPrevShares = parseFloat(accumulator[p['instrument']['symbol']]['shares']);
            let prevAvgPrice = parseFloat(accumulator[p['instrument']['symbol']]['averagePrice']);

            let numNewShares = parseFloat(p['longQuantity'])
            let newAvgPrice = parseFloat(p['averagePrice'])

            console.log(newAvgPrice)
            console.log(prevAvgPrice)
            console.log(numNewShares)
            console.log(numPrevShares)
            console.log()

            accumulator[p['instrument']['symbol']]['marketValue'] += p['marketValue']
            accumulator[p['instrument']['symbol']]['shares'] += p['longQuantity']
            accumulator[p['instrument']['symbol']]['averagePrice'] = ((numPrevShares * prevAvgPrice) + (numNewShares * newAvgPrice)) / (numNewShares + numPrevShares);
            // console.log(accumulator[p['instrument']['symbol']]['averagePrice'])
        } else {
            accumulator[p['instrument']['symbol']] = {
                'marketValue': p['marketValue'],
                'shares': p['longQuantity'],
                'averagePrice': p['averagePrice']
            }
        }
    })
    // console.log(accumulator)
    writePositions(accumulator)
}

let writePositions = (accumulator) => {
    let writer = csvWriter({ sendHeaders: false })
    writer.pipe(fs.createWriteStream('data/positions.csv', { "flags": 'a' }));

    for (let key of Object.keys(accumulator)) {
        let obj = {
            time: new Date().getTime(),
            ticker: key,
            avgeragePrice: accumulator[key]['averagePrice'],
            shares: accumulator[key]['shares'],
            value: accumulator[key]['marketValue']
        }
        // console.log(obj)
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