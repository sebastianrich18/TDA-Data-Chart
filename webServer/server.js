const csv = require('csv-parser')
const fs = require('fs')
const express = require("express");
const app = express();
const PORT = 80;
let posData = {};
let valData = {};

app.get("/", (req, res) => {
    readValueData();
    readPositionsData();
    setTimeout(() => { sendData(res) }, 1000)
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});

function readPositionsData() {
    let results = [];

    fs.createReadStream('../data/positions.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            //console.log(results);
            formatPositionData(results);
        });
}

function readValueData() {
    let results = [];

    fs.createReadStream('../data/value.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            // console.log(results);
            formatValueData(results);
        });
}

function formatPositionData(results) {
    let accumulator = {}; // keys are tickers vals are obj with keys x, y that are arrays
    for (let line of results) {
        if (line['ticker'] in accumulator) {
            console.log(line)
            let date = new Date(parseInt(line['time']))
            let formattedDate = date.getMonth() + "/" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
            accumulator[line['ticker']]['x'].push(formattedDate)
            accumulator[line['ticker']]['y'].push(line['value'])
            
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
    posData = traces;
}

function formatValueData(results) {
    let formattedData = { 'x': [], 'y': [], 'type': "scatter" };
    for (let line of results) {
        let date = new Date(parseInt(line['time']))
        let formattedDate = date.getMonth() + "/" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
        //console.log(formattedDate)
        formattedData['x'].push(formattedDate);
        formattedData['y'].push(parseInt(line['value']).toFixed(2));
    }
    valData = formattedData;
}

function sendData(res) {
    let html = `
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>Stonks Go Up</title>
        <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
    </head>
    <body>
        <div id="value"></div>
        <div id="positions"></div>
        <script>
            let valDiv = document.getElementById('value');
            let valData = JSON.parse('${JSON.stringify(valData)}')
            console.log(valData)
            Plotly.newPlot(valDiv, [valData])

            let posDiv = document.getElementById('positions');
            let posData = JSON.parse('${JSON.stringify(posData)}')
            console.log(posData)
            Plotly.newPlot(posDiv, posData)
        </script>
    </body>
    </html>
    `
    res.send(html)
}
