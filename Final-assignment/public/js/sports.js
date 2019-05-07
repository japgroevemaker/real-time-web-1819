let socket = io('/sports')

let myId;

socket.on('connect', function() {
  console.log("connection made id", socket.id);
  myId = socket.id
})

// ------------Twitter stream------------
const formTwitter = document.querySelector('#change-genre'),
  setGenre = document.querySelector('#set-genre'),
  tweetSubmit = document.querySelector('#genre-submit'),
  checkboxContainer = document.querySelector('#checkbox-container'),
  checkbox = document.querySelectorAll('#checkbox-container input');

socket.on("checkboxChange", function(genre, value) {
  console.log(value);
  console.log("Somebody clicked " + genre);

  let div = document.createElement('div');
  div.classList.add('line')
  let genChange = document.createTextNode(genre);
  let twitterOutput =  document.getElementById('twitter-output');

  div.appendChild(genChange)
  twitterOutput.appendChild(div)

  if (document.getElementById(genre)) {
    console.log("checkbox bestaat");
    document.getElementById(genre).checked = value
  } else {
    console.log("Checkbox doesn't exist");
    document.createElement(genre)

    let label = document.createElement('label')
    label.setAttribute('for', genre)
    label.innerHTML = genre

    let input = document.createElement('input')
    input.setAttribute('id', genre)
    input.setAttribute('type', 'checkbox');
    input.setAttribute('value', genre)

    input.checked = true

    checkboxContainer.appendChild(label)
    checkboxContainer.appendChild(input)
  }
  socket.emit('checkboxChange', genre)
})

socket.on("newCheckbox", function(id) {
  console.log(id);
  createNewCheckbox(id)
})

function createNewCheckbox(id) {
  let value
  if (id) {
    value = id
  } else {
    value = setGenre.value
  }
  console.log(setGenre.value)

  let label = document.createElement('label')
  label.setAttribute('for', value)
  label.innerHTML = value

  let input = document.createElement('input')
  input.setAttribute('id', value)
  input.setAttribute('type', 'checkbox');
  input.setAttribute('value', value)

  checkboxContainer.appendChild(input)
  checkboxContainer.appendChild(label)


  setGenre.value = ''

  let newCheckbox = document.querySelectorAll('#checkbox-container input');

  if (!id) {
    socket.emit("createCheckbox", value)
  }

  newCheckbox.forEach(function(recheck) {
    recheck.addEventListener('click', function() {

      let div = document.createElement('div');
      let genChange = document.createTextNode(recheck.value);
      let twitterOutput =  document.getElementById('twitter-output');

      div.appendChild(genChange)
      div.classList.add('line')
      twitterOutput.appendChild(div)

      console.log(recheck.checked);
      console.log(recheck.value);
      socket.emit("tweetGenre", recheck.id, recheck.checked)
    })
  })

}

formTwitter.addEventListener('submit', function(e) {
  e.preventDefault()
  createNewCheckbox()
})

socket.on('tweet', function(stream) {
  console.log("nieuwe twit");
  console.log(stream);

  let tweetContainer = document.getElementById('twitter-output'),
    tweet = document.createElement('section'),
    tweetHeader = document.createElement('div'),
    tweetMain = document.createElement('div'),
    tweetText = document.createElement('p'),
    tweetNickName = document.createElement('h2'),
    tweetUserName = document.createElement('h3'),
    tweetUserImg = document.createElement('img'),
    tweetUserDetailContainer = document.createElement('div');

  tweetHeader.classList.add('tweet-header')
  tweetMain.classList.add('tweet-main')
  tweetUserDetailContainer.classList.add('detail-container')

  tweetUserImg.src = stream.user.profile_image_url;


  let tweetUserNameText = document.createTextNode(stream.user.name),
      tweetNickNameText = document.createTextNode('@' + stream.user.screen_name)


      if (stream.retweeted_status) {
        if (stream.retweeted_status.extended_tweet) {

          // let text = stream.retweeted_status.extended_tweet.full_text
          //
          // function urlify(text) {
          //   let regex = /\bhttps?:\/\/\S+/gi
          //   return text.replace(regex, function(url){
          //     console.log(url);
          //     return '<a href="' + url + '">' + url + '</a>';
          //   })
          // }
          // let html = urlify(text)

          let retweetTextData = document.createTextNode(stream.retweeted_status.extended_tweet.full_text)
          tweetText.appendChild(retweetTextData)

        } else {
          let retweetTextData = document.createTextNode(stream.retweeted_status.text)
          tweetText.appendChild(retweetTextData)
        }
      } else if (stream.extended_tweet) {
        console.log('False');
        let extendedTweetData = document.createTextNode(stream.extended_tweet.full_text)
        tweetText.appendChild(extendedTweetData)
      } else {
        let tweetTextData = document.createTextNode(stream.text);
        tweetText.appendChild(tweetTextData)
      }


  tweetUserName.appendChild(tweetUserNameText)
  tweetNickName.appendChild(tweetNickNameText);

  tweetHeader.appendChild(tweetUserImg)
  tweetUserDetailContainer.appendChild(tweetNickName)
  tweetUserDetailContainer.appendChild(tweetUserName)
  tweetHeader.appendChild(tweetUserDetailContainer);

  tweetMain.appendChild(tweetText)

  tweet.appendChild(tweetHeader)
  tweet.appendChild(tweetMain)


  tweetContainer.appendChild(tweet)
})

checkbox.forEach(function(checked) {
  checked.addEventListener("click", function() {

    let div = document.createElement('div');
    div.classList.add('list')
    let genChange = document.createTextNode(checked.value);
    let twitterOutput =  document.getElementById('twitter-output');

    div.appendChild(genChange)
    twitterOutput.appendChild(div)

    console.log(checked.value);
    socket.emit('tweetGenre', checked.id, checked.checked)
  })
})

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

  if (message.value !== '') {
    socket.emit('chat', {
      message: message.value,
      name: myName
    });
  }
  message.value = ''
})

message.addEventListener('keypress', function() {
  socket.emit('typing', myName)
})

socket.on('chat', function(data, id, time) {
  feedback.innerHTML = ''

  time = time.slice(8, 14);

let output = document.getElementById('output');

  let newMessageItem = document.createElement('p');
  let newTimeItem = document.createElement('p');
  newTimeItem.classList.add('time')
  let newMessageRow = document.createElement('div');
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


socket.on('typing', function(data) {
  feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});
