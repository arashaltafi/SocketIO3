const http = require("http")
const express = require("express")
const main = require("./controllers/main")
const { config, corsHeader } = require("./cors/cors")
require("dotenv/config")
const app = express()
const server = http.createServer(app)
const io = require("socket.io").listen(server, {
  cors: corsHeader,
})
const PORT = process.env.PORT || 5000

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html")
})

io.on("connection", (socket) => {
  main(io, socket)
})

//Inicia el servidor
server.listen(5000, () => {
    console.log('Node app is running on port 5000');
});