// ------------Create checkbox------------
const formTwitter = document.querySelector('#change-genre'),
  setGenre = document.querySelector('#set-genre'),
  tweetSubmit = document.querySelector('#genre-submit'),
  checkboxContainer = document.querySelector('#checkbox-container'),
  checkbox = document.querySelectorAll('#checkbox-container input');

socket.on("checkboxChange", function(genre, value) {
  console.log(value);
  console.log("Somebody clicked " + genre);

  let div = document.createElement('div');
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
