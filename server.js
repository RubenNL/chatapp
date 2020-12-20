const http=require('http')
const express = require('express')
const WebSocket=require('ws')
const app = express()
app.use(express.json());
const server = http.createServer(app);
const wss=new WebSocket.Server({server});
const compression = require('compression')
app.use(compression({filter:shouldCompress}))
function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) return false
  return compression.filter(req, res)
}

app.use(express.static('output'))

require('./server/server.js')(app,wss)
.then(()=>{
	app.use((req,res)=>res.sendFile(__dirname+'/output/index.html'))
})

server.listen(process.env.PORT||8000)
