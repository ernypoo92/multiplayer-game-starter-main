addEventListener('click', (event) => {
  
  const playerPosition = {
    x: frontendPlayers[socket.id].x,
    y: frontendPlayers[socket.id].y
  }
  //Math.atan2 frinds the tangent from the client to the click location. Chris Courses and Net Ninja made course on trig functions in code.
  const angle = Math.atan2(
    (event.clientY * window.devicePixelRatio) - playerPosition.y,
    (event.clientX * window.devicePixelRatio) - playerPosition.x
  )
  // const velocity = {
  //   x: Math.cos(angle) * 5,
  //   y: Math.sin(angle) * 5
  // }

  socket.emit('shoot', {
    x:playerPosition.x, 
    y:playerPosition.y,
    angle
  })
  // frontendProjectiles.push(
  //   new Projectile({
  //     x:playerPosition.x, 
  //     y:playerPosition.y, 
  //     radius: 5, 
  //     color: 'white', 
  //     velocity})
  // )
  console.log(frontendProjectiles)
})
