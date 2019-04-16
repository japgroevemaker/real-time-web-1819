// let socket = io();

const socket = io('/news');

const message = document.getElementById('message');
      btn = document.getElementById('send'),
      output = document.getElementById('output'),
      handle = document.getElementById('name'),
      feedback = document.getElementById('feedback'),
      form = document.querySelector('form')

form.addEventListener('submit', function(e){
  e.preventDefault()
})

btn.addEventListener('click', function(){
  socket.emit('chat', {
    message: message.value,
    handle: handle.value
  });
  message.value = ''
})

message.addEventListener('keypress', function() {
  socket.emit('typing', handle.value)
})

socket.on('chat', function(data) {
  if (handle.value == '') {
    data.handle = 'Anoniem'
    handle.value = 'Anoniem'
  }

  feedback.innerHTML = "";
  output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';

});

socket.on('typing', function(data){
  feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});

// news.on('news', function(data){
//   news.emit('woot')
// })
