let socket = io('/news')

let myId;

socket.on('connect', function() {
  console.log("connection made id", socket.id);
  myId = socket.id
})
