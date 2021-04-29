function ajaxGetRequest(path, callback) {
  let request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      callback(this.response);
    }
  }
  request.open("GET", path);
  request.send();
}

function setPositionsData(response) {
  let data = JSON.parse(response)
  console.log(data)
  let layout = { "title": "Positions" }
  Plotly.newPlot('positions', data, layout)
}

function setValueData(response) {
  let data = JSON.parse(response)
  console.log(data)
  let layout = { "title": "Total Account Value", "yaxis":{}}
  if (getRadioValue() == 'dollar') {
    layout['yaxis']['tickformat'] = '$'
  } else {
    layout['yaxis']['tickformat'] = '.3%'

  }
  Plotly.newPlot('value', [data], layout)
}

function getData() { // called onload
  let params = "?type=" + getRadioValue()
  ajaxGetRequest('/value'+params, setValueData);
  ajaxGetRequest('/positions'+params, setPositionsData);
}

function getRadioValue() {
  for (let radio of document.getElementsByName('type')) {
    if (radio.checked) return radio.value;
  }
}