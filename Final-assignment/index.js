const express = require('express');
const session = require('express-session');
const ejs = require('ejs');
const bodyParser = require('body-parser')
const app = express();
const socket = require('socket.io');
const Twit = require('twit');
const fs = require('fs');
const data = fs.readFileSync('users.json');
const users = JSON.parse(data);


// check if authenticated, if not redirect back to login
const redirectLogin = function(req, res, next) {
  if(!req.session.userId){
    res.redirect('/login')
  } else {
    next()
  }
}

// if already authenticated, send to home page
const redirectHome = function(req, res, next) {
  if (req.session.userId) {
    res.redirect('/')
  } else {
    next()
  }
}

app.set('view engine', 'ejs')

app.use(express.static('public'), bodyParser.urlencoded({ extended: false }))

app.use(session({
  name: 'sid', // default name of session id
  resave: false, //saves back to session store, even if it wasn't modified during the request
  saveUninitialized: false,
  secret: 'secretKey',

  cookie: { // set cookie configuration
    maxAge: 1000 * 60 * 60 * 2, // number of millisecond when cookie expires
    sameSite: true // only accepts cookie if it comes from the same origin
  }
}))

// res.locals = An object that contains response local variables scoped to the request.
app.use(function(req, res, next){
  const { userId } = req.session;
  if (userId) {
    res.locals.user = users.find(function(users) {
        return users.id === userId
      }
    )
  }
  next()
})

app.get('/login', redirectHome, function(req, res){
  res.render("login")
})

app.post('/login', redirectHome, function(req, res){
  const {email, password} = req.body

  if (email && password) {

    const user = users.find(function(user) {
        return user.email === email && user.password === password
      })

    if (user) {
      req.session.userId = user.id
      return res.redirect('/')
    }
  }
  res.redirect('/login')
})

app.get('/register', function(req, res) {
  res.render('register')
})

app.post('/register', redirectHome, function(req, res){
  console.log(users);
  const { email, password, name, nickname} = req.body

  if (name && nickname && email && password) {
    const exists = users.some(function(user){
      return user.email === email
    })

    if (!exists) {
      const user = {
        id: users.length + 1,
        name,
        nickname,
        email,
        password,
      }

      users.push(user)
      let data = JSON.stringify(users, null, 2)

      fs.writeFile('users.json', data, finished)

      function finished(err) {
        console.log('all set');
      }

      console.log(users);

      req.session.userId = user.id

      return res.redirect('/')
    }
  }
res.redirect('/register') // queryStringerror=error.auth.emailTooShort
})

app.post('/logout', redirectLogin, function(req, res){
  req.session.destroy(function(err){
    if (err) {
      res.redirect('/')
    }
    res.clearCookie('sid')
    res.redirect('/login')
  })
})

app.get('/', redirectLogin, function(req, res){
  const { user } = res.locals

  const { userId } = req.session
  // console.log(req.session.id);
  res.render("index");
})

app.get('/sports', redirectLogin, function(req, res) {
  const { user } = res.locals
  res.render("sports")
})

app.get('/news', redirectLogin, function(req, res) {
  const { user } = res.locals
  res.render("news")
})


let T = new Twit({
  consumer_key:         'roz8tFgK8w9elwL1K8dmpZSlt',
  consumer_secret:      'mrIwaSIUK9LcIT5wYiujA2WNXWMJPvoupqHRVnf3TXMsPY7805',
  access_token:         '741148952851034112-ETDOWGB8P1fkOLcf02Y28szagRBSYds',
  access_token_secret:  'aB3fNVspjonDDXUVERns9ElHnPebJ9eQ3G8LeTTzRMLaU',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})


let server = app.listen(1000);
console.log("Port 1000");

const io = socket(server);

// Namespaces
const sports = io.of('/sports')
const news = io.of('/news')

// -------------sports-------------
sports.on('connection', function(socket) {
  console.log("User connected", socket.id);

  // socket.broadcast.emit("newUser", socket.id)

  socket.on('setUserName', function(name, id){
    socket.username = name
    console.log(name);
    socket.broadcast.emit('newName', socket.id, socket.username);
  })

  socket.on('chat', function(data, time){

    let timeStamp = new Date()
    let newTime = timeStamp.toLocaleString()

    time = newTime
    console.log(time);
    sports.emit('chat', data, socket.id, time)
  })

  socket.on('typing', function(data){
    socket.broadcast.emit('typing', data)
  })

  // custom tweetstream params
  let tweetGenreSports = []

  let params = {
    track: 'PSV'
  }

  let streamSports = T.stream('statuses/filter', params)

  streamSports.on('tweet', function(tweet){
    console.log(tweet.text);
    socket.emit('tweet', tweet)
  });

  socket.on("createCheckbox", function (id){
    console.log("Create checkekckeockekco");
    socket.broadcast.emit("newCheckbox", id)
  })

  socket.on('disconnect', function(){
    console.log("user disconnect");
    streamSports.stop()
    socket.broadcast.emit('userLeft', socket.username);
  })

  socket.on('tweetGenre', function(id, value) {

    console.log(value);
    socket.broadcast.emit("checkboxChange", id, value)
    streamSports.stop()

    changeArray(id, value)

    function changeArray (id, value) {
      id = id.toLowerCase()
      if (tweetGenreSports.includes(id) && !value){
        tweetGenreSports.splice(tweetGenreSports.indexOf(id), 1)
        console.log(tweetGenreSports);
      } else if (value) {
        if (tweetGenreSports.includes(id)) {
          return
        } else {
          tweetGenreSports.push(id)
        }
      }
    }

    if(tweetGenreSports.length === 0){
      console.log('its empty');
    } else {
      console.log('something in it');
    }

    let searchQuery = {
      track: tweetGenreSports
    }

    console.log(searchQuery.track);

    streamSports = T.stream('statuses/filter', searchQuery)

    streamSports.on('tweet', function(tweet) {
      console.log(tweet.text);
      socket.emit('tweet', tweet)
      socket.broadcast.emit('tweet', tweet)
    })

  })

})

// -------------news-------------
news.on('connection', function(socket) {
  console.log("User connected", socket.id);

  // socket.broadcast.emit("newUser", socket.id)

  socket.on('setUserName', function(name, id){
    socket.username = name
    console.log(name);
    socket.broadcast.emit('newName', socket.id, socket.username);
  })

  socket.on('chat', function(data){

    let timeStamp = new Date()
    let newTime = timeStamp.toLocaleString()

    time = newTime
    console.log(time);
    news.emit('chat', data, socket.id, time)
  })

  socket.on('typing', function(data){
    socket.broadcast.emit('typing', data)
  })

  // custom tweetstream params
  let tweetGenreNews = []

  let params = {
    track: 'trump'
  }

  let streamNews = T.stream('statuses/filter', params)

  streamNews.on('tweet', function(tweet){
    console.log(tweet.text);
    socket.emit('tweet', tweet)
  });

  socket.on("createCheckbox", function (id){
    console.log("Create checkekckeockekco");
    socket.broadcast.emit("newCheckbox", id)
  })

  socket.on('disconnect', function(){
    console.log("user disconnect");
    streamNews.stop()
    socket.broadcast.emit('userLeft', socket.username);
  })

  socket.on('tweetGenre', function(id, value) {

    console.log(value);
    socket.broadcast.emit("checkboxChange", id, value)
    streamNews.stop()

    changeArray(id, value)

    function changeArray (id, value) {
      id = id.toLowerCase()
      if (tweetGenreNews.includes(id) && !value){
        tweetGenreNews.splice(tweetGenreNews.indexOf(id), 1)
      } else if (value) {
        if (tweetGenreNews.includes(id)) {
          return
        } else {
          tweetGenreNews.push(id)
        }
      }
    }

    if(tweetGenreNews.length === 0){
      console.log('its empty');
    } else {
      console.log('something in it');
    }

    let searchQuery = {
      track: tweetGenreNews
    }

    console.log(searchQuery.track);

    streamNews = T.stream('statuses/filter', searchQuery)

    streamNews.on('tweet', function(tweet) {
      console.log(tweet.text);
      socket.emit('tweet', tweet)
      socket.broadcast.emit('tweet', tweet)
    })

  })

})
