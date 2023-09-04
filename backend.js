//Backend code
const { Socket } = require('dgram')
const express = require('express')
const app = express()

// socket.io setup
const http = require('http')//starts an http server
const server = http.createServer(app)//wraps the http server with express
const { Server } = require('socket.io') //starts a socket.io server
const io = new Server(server, { pingInterval: 2000, pingTimeout: 5000 })//Runs a socket.io through express and sets a ping interval of 2s and a timeout of 5s

const port = 3000

app.use(express.static('public'))//uses express to deliver static files

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})//express setting up the HTTP Get method

const backendPlayers = {}//an object containing the active backendPlayers. Is an object for faster performance.
const backendProjectiles = {}

const SPEED = 10
let projectileId = 0

io.on('connection', (socket) => {
  console.log('a user connected')
  backendPlayers[socket.id] = {
    x: 500 * Math.random(),
    y: 500 * Math.random(),
    color: `hsl(${360*Math.random()}, 100%, 50%)`,
    sequenceNumber: 0
  }//when a player joins this generates an id and sets a starting x and y

  io.emit('updatePlayers',  backendPlayers)//sends backendPlayers object to front end
  //handels projectiles on back end
  socket.on('shoot', ({x, y, angle}) =>{
    projectileId++
    
    const velocity = {
    x: Math.cos(angle) * 5,
    y: Math.sin(angle) * 5
  }

    backendProjectiles[projectileId] = {
      x, 
      y, 
      velocity,
      playerId: socket.id
    }
  })

  socket.on('disconnect', (reason) => {
    console.log(reason)
    delete backendPlayers[socket.id]
    io.emit('updatePlayers')
  })//if a player disconnects from the game it will remove the player from the backendPlayers object

  socket.on('keydown', ({keycode, sequenceNumber}) => {
    backendPlayers[socket.id].sequenceNumber = sequenceNumber
    switch(keycode) {
      case 'KeyW' :
        backendPlayers[socket.id].y -= SPEED
        break
      case 'KeyA' :
        backendPlayers[socket.id].x -= SPEED
        break
      case 'KeyS' :
        backendPlayers[socket.id].y += SPEED
        break
      case 'KeyD' :
        backendPlayers[socket.id].x += SPEED
        break
    }
  })

  console.log(backendPlayers)
})
//backend ticker
setInterval(() => {
  //update projectile position
  for(const id in backendProjectiles) {
    backendProjectiles[id].x += backendProjectiles[id].velocity.x,
    backendProjectiles[id].y += backendProjectiles[id].velocity.y
  }

  io.emit('updateProjectiles', backendProjectiles)
  io.emit('updatePlayers', backendPlayers)
}, 15)//sends a reply avery 15 ms

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})//starts the express server sto start listening on the port 3000(see port above)
