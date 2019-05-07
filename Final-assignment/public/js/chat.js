// ------------Chat------------

var myName = document.getElementById('user-name').innerText
console.log(myName);
socket.emit('setUserName', myName)

  let message = document.getElementById('message')
  let btn = document.getElementById('send')
  let feedback = document.getElementById('feedback')
  let formChat = document.getElementById('send-message')
  let joinedUser = document.getElementById('joined-users');

  socket.on('newName', function(id, name){
    console.log("new username for user: " + id + " name: " + name);
    feedback.innerHTML = '<p>' + name + "joined the room</p>"

    let paragraph = document.createElement('p');
    let wrapper =  document.createElement('span');

    let paragraphUserText = document.createTextNode(name);

    paragraph.appendChild(paragraphUserText)
    wrapper.appendChild(paragraph)
    joinedUser.appendChild(wrapper);
    console.log(joinedUser.children);
  })

socket.on('userLeft', function(name) {
  console.log('user disconnected ' + name);
  feedback.innerHTML = '<p><em>' + name + ' left the room.</em></p>';

  // let getUser = document.querySelector('#joined-users p');
  //
  // if (getUser.parentNode) {
  //   getUser.parentNode.removeChild(getUser)
  // }

})

message.addEventListener('keypress', function (event){
  feedback.innerHTML = "";
    if(event.which === 13 && !event.shiftKey){
        event.target.form.dispatchEvent(new Event("submit", {cancelable: true}));
        event.preventDefault();

        if (message.value !== '') {
          socket.emit('chat', {
            message: message.value,
            name: myName
          });
        }
        message.value = ''
    }
})

formChat.addEventListener('submit', function(e) {
  e.preventDefault()
})

btn.addEventListener('click', function() {
  feedback.innerHTML = "";

  if (message.value !== '') {
    socket.emit('chat', {
      message: message.value,
      name: myName
    });
  }
  message.value = ''
})


socket.on('chat', function(data, id, time) {
  feedback.innerHTML = "";

  time = time.slice(8, 14);

let output = document.getElementById('output');

  let newMessageItem = document.createElement('p');
  let newMessageRow = document.createElement('div');
  let newTimeItem = document.createElement('p');
  newTimeItem.classList.add('time')
  let chatUserName = document.createElement('h3');
  let chatUser = document.createElement('div');
  chatUser.classList.add('username');
  newMessageRow.classList.add('message-row');

  chatUserName.innerText = data.name;
  newMessageItem.innerText = data.message
  newTimeItem.innerText = time;

  if (data.name + id === myName + myId) {
    newMessageItem.classList.add('self')

    if (newMessageItem.classList.contains('self')) {
      chatUserName.style.display = 'none'
      newMessageRow.style = 'justify-content: flex-end'
      chatUser.classList.add('color')
    }

  } else {
    newMessageItem.classList.add('other')
  }

  chatUser.appendChild(chatUserName);
  chatUser.appendChild(newMessageItem);
  chatUser.appendChild(newTimeItem);
  newMessageRow.appendChild(chatUser);
  output.appendChild(newMessageRow);

  if (newMessageItem.innerText.length > 20 && newMessageItem.innerText.length <= 30) {
    console.log('higher then 20, but between 30');
    chatUser.style.width = 'auto'
    newMessageItem.style.width = '90%'
  } else if (newMessageItem.innerText.length > 30) {
    chatUser.style = 'width: 45%;'
    newMessageItem.style = 'word-wrap: break-word'
  }

});

message.addEventListener('keypress', function() {
  socket.emit('typing', myName)
})

socket.on('typing', function(data) {
  feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});
