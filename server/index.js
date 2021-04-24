const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const socketManage = require('./socketManage')(io)
const PORT = process.env.PORT || 4000
const path = require('path')


io.on('connection', socketManage )
// In dev mode just hide hide app.uss(... ) below
app.use( express.static(path.join(__dirname, '../build')))
server.listen( PORT, () => console.log('App was start at port : ' + PORT ))
