const socket = io();

let userName;
let myId;

 const handle = document.getElementById('name'),
       setName = document.getElementById('setName'),
       form = document.querySelector('form');

form.addEventListener('submit', function(e){
  e.preventDefault()
})

socket.on('connect', function(){
  console.log('connection made');
  myId = socket.io.engine.id;
  console.log(myId);
})

setName.addEventListener('click', function(){
  socket.emit('setUserName', handle.value)
  console.log('sending username ' + handle.value);
  overlay.style.display = 'none'
})

socket.on('newName', function(id, name) {
  console.log("new username for user: " + id + " name: " + name);
  userName = name
});

socket.on('newUser', function(id) {
  console.log("new user detected:" + id);
})
