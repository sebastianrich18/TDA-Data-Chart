const csv = require('csv-parser')
const fs = require('fs')
const express = require("express");
const app = express();
const PORT = 80;
let posData = {};
let valData = {};

app.use(express.static('static'))

app.get("/", (req, res) => {
    res.sendFile('static/index.html', { root: __dirname })
});

app.get("/index.js", (req, res) => {
    res.sendFile('static/index.js', { root: __dirname })
});

app.get('/positions', (req, res) => {
    let type = req.query['type']
    console.log('got pos req with param ' + type)
    readPositionsData(res, type);
})

app.get('/value', (req, res) => {
    let type = req.query['type']
    console.log('got value req with param ' + type)
    readValueData(res, type);
})

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});

function readPositionsData(res, type) {
    let results = [];

    fs.createReadStream('../data/positions.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            //console.log(results);
            formatPositionData(results, res, type);
        });
}

function readValueData(res, type) {
    let results = [];

    fs.createReadStream('../data/value.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            // console.log(results);
            formatValueData(results, res, type);
        });
}

function formatPositionData(results, res, type) {
    let accumulator = {}; // keys are tickers vals are obj with keys x, y that are arrays
    for (let line of results) {
        if (line['ticker'] in accumulator) {
            // console.log(line)
            let date = new Date(parseInt(line['time']))
            let formattedDate = date.getMonth() + "/" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
            accumulator[line['ticker']]['x'].push(formattedDate)
            if (type == 'dollar'){
                accumulator[line['ticker']]['y'].push(line['value'])
            } else {
                let shares = parseInt(line['shares'])
                let value = parseFloat(line['value'])
                let avg = parseFloat(line['averagePrice'])
                accumulator[line['ticker']]['y'].push((value / shares) / avg - 1)
            }

        } else {
            accumulator[line['ticker']] = { 'x': [], 'y': [] }
        }
    }

    let traces = [];
    for (let [key, value] of Object.entries(accumulator)) {
        if (key == "MMDA1") key = "CASH"
        let obj = { x: value['x'], y: value['y'], type: 'line', name: key }
        traces.push(obj)
    }
    //console.log(traces);
    res.send(traces)
}

function formatValueData(results, res, type) {
    let formattedData = { 'x': [], 'y': [], 'type': "scatter" };
    for (let line of results) {
        let date = new Date(parseInt(line['time']))
        let formattedDate = date.getMonth() + "/" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
        //console.log(formattedDate)
        formattedData['x'].push(formattedDate);
        if (type == 'dollar') {
            formattedData['y'].push(parseInt(line['value']).toFixed(2));
        } else {
            formattedData['y'].push((parseFloat(line['value']) - parseFloat(results[0]['value'])) / parseFloat(results[0]['value']));
        }
    }

    res.send(formattedData)
}
