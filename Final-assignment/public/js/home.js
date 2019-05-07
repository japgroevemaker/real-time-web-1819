let socket = io()

let nickName;

let form = document.querySelector('#overlay form');
let userName = document.querySelector('#nickName');
let submit = document.querySelector('.submit-button');
let overlay = document.querySelector('#overlay');
let welcomeMessage = document.querySelector('.welcome-message');

// form.addEventListener("submit", function(e){
//   e.preventDefault();
//   socket.emit("setUserName", userName.value)
//   overlay.style.display = 'none'
// })

socket.on('newUserName', function(id, name) {
  console.log("new username for user: " + id + " name: " + name);
  nickName = name
  welcomeMessage.innerHTML = 'Welcome ' + nickName
})

// socket.on('newUser', function(id) {
//   console.log("New user detected", id);
// })

// submit.addEventListener('click', function(){
//   console.log(userName.value);
// })

socket.on('connect', function(){
  console.log('Connection made', socket.id);
});

// socket.on('tweet', function(stream){
//   console.log(stream.text);
// })
