const electron = require('electron')
const path = require('path')
const axios = require('axios')

const BrowserWindow = electron.remote.BrowserWindow
const ipc = electron.ipcRenderer

const notifyBtn = document.getElementById('notifyBtn')

var price = document.querySelector('h1')
var targetPrice =document.getElementById('targetPrice')
var targetPriceValue

const notification = {
  title: 'BTC Alert',
  body: 'BTC just beat your target price!',
  icon: path.join(__dirname, '../assets/images/btc.png')
}

function getBTC() {
  axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=INR')
    .then(res => {
      const cryptos = res.data.BTC.INR
      price.innerHTML = '₹' + cryptos.toLocaleString('hi')

      if (targetPrice.innerHTML != '' && targetPriceValue < res.data.BTC.INR) {
        const myNotification = new window.Notification(notification.title, notification)
      }
    })
}

getBTC()
setInterval(getBTC, 1000)

notifyBtn.addEventListener('click', function (event) {
  const modalPath = path.join('file://', __dirname, 'add.html')
  let win = new BrowserWindow({ frame: false, transparent: true, alwaysOnTop: true, width: 400, height: 200 })
  win.on('close', function () { win = null })
  win.loadURL(modalPath)
  win.show()
})

ipc.on('targetPriceValue', function (event, arg) {
  targetPriceValue = Number(arg)
  targetPrice.innerHTML = '₹' + targetPriceValue.toLocaleString('hi')
})
