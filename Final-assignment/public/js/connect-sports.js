let socket = io('/sports')

let myId;

socket.on('connect', function() {
  console.log("connection made id", socket.id);
  myId = socket.id
})
