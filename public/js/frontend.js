const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
// making a connection with the websocket server
const socket = io()

const scoreEl = document.querySelector('#scoreEl')

const devicePixelRatio = window.devicePixelRatio || 1 //increases the number of pixels on higher resolution screens. If not available it returns a 1(base value)

canvas.width = innerWidth * devicePixelRatio
canvas.height = innerHeight * devicePixelRatio

const x = canvas.width / 2
const y = canvas.height / 2
//creates new player
//const player = new Player(x, y, 10, 'white')
//Where object of players is stored from the backend
const frontendPlayers = {}
//takes backend player object fand adds to the front end
socket.on('updatePlayers', (backendPlayers) => {
  for(const id in backendPlayers) {
    const backendPlayer = backendPlayers[id]
    // If new to the game this triggers a new object from the player class
    if(!frontendPlayers[id]) {
      frontendPlayers[id] = new Player({
        x:backendPlayer.x, 
        y:backendPlayer.y, 
        radius:10 * devicePixelRatio, 
        color: backendPlayer.color})
    }
  }
  //removes a player from the front end if they are removed from the backend
  for (const id in frontendPlayers){
    if(!backendPlayers[id]){
      delete frontendPlayers.id
    }
  }
})

let animationId
function animate() {
  animationId = requestAnimationFrame(animate)
  c.fillStyle = 'rgba(0, 0, 0, 0.1)'
  c.fillRect(0, 0, canvas.width, canvas.height)

  for(const id in frontendPlayers) {
    const frontendPlayer = frontendPlayers[id]
    frontendPlayer.draw()
  }

  
}

animate()

