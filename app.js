const csvWriter = require('csv-write-stream')
const tda = require('tda-api-client');
const fs = require('fs');


let getValue = async () => {
    let accounts = await tda.accounts.getAccounts({ fields: "positions" })
    let totalValue = 0;
    totalValue += await accounts[0]['securitiesAccount']['currentBalances']['liquidationValue'];
    totalValue += await accounts[1]['securitiesAccount']['currentBalances']['liquidationValue'];
    handleValue(totalValue);
}

let handleValue = (accVal) => {
    console.log(accVal)
    var writer = csvWriter()
    writer.pipe(fs.createWriteStream('data/value.csv'), {flags: 'a'});
    writer.write({ time: new Date().getTime(), value: accVal })
    writer.end()
}

getValue();
