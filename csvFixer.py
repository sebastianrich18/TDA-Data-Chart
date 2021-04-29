import csv

data = []

with open('data/positions.csv', 'r') as f:
  data = list(csv.reader(f))

data = list(filter(None, data))

for i in range(len(data) - 1):
  if data[i][1] == "TAN":
    data[i][2] = "71.648"
  elif data[i][1] == "AAPL":
    data[i][2] = "116.75"
  elif data[i][1] == "SNDL":
    data[i][2] = ".395"
  elif data[i][1] == "FRX":
    data[i][2] = "10.39"
  elif data[i][1] == "COIN":
    data[i][2] = "380"
  elif data[i][1] == "MSFT":
    data[i][2] = "220.34"
  elif data[i][1] == "TSLA":
    data[i][2] = "431.0525"
  elif data[i][1] == "MMDA":
    data[i][2] = "1"
  elif data[i][1] == "EBS":
    data[i][2] = "93.79"
  elif data[i][1] == "AMD":
    data[i][2] = "66.902"
  elif data[i][1] == "SPY":
    data[i][2] = "348.185"
  elif data[i][1] == "GME":
    data[i][2] = "380"
  elif data[i][1] == "VBK":
    data[i][2] = "233.753"
  elif data[i][1] == "VISL":
    data[i][2] = "3.263"
  elif data[i][1] == "TSM":
    data[i][2] = "109.15"
  elif data[i][1] == "NIO":
    data[i][2] = "42.059"
  elif data[i][1] == "BA":
    data[i][2] = "471.8"
  elif data[i][1] == "CCIV":
    data[i][2] = "35.766"
  elif data[i][1] == "AMC":
    data[i][2] = "13.11"
  elif data[i][1] == "TLRY":
    data[i][2] = "21.81"
  elif data[i][1] == "JETS":
    data[i][2] = "17.265"
  elif data[i][1] == "VNQ":
    data[i][2] = "80.836"
  elif data[i][1] == "PLTR":
    data[i][2] = "26.875"
  elif data[i][1] == "MARA":
    data[i][2] = "37.9"
  elif data[i][1] == "SOL":
    data[i][2] = "20.951"
  elif data[i][1] == "JMIA":
    data[i][2] = "37.52"

with open('data/positions.csv', 'w', newline='') as f:
  writer = csv.writer(f)
  writer.writerows(data)