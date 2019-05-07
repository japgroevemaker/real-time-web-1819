const express = require('express');
const ejs = require('ejs');
const app = express()
const socket = require('socket.io');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get("/", function(req, res){
  res.render("index")
});

app.get("/news", function(req, res){
  res.render("news")
})

app.get("/sports", function(req, res){
  res.render("sports")
})

let server = app.listen(3000);
console.log('Port 3000');

let io = socket(server)

// namespaces
const news = io.of('/news');
const sports = io.of('/sports')


// ----------------news----------------
  news.on('connection', function(socket){
    console.log('User connected', socket.id);
    socket.on('chat', function(data){
      news.emit('chat', data)
    })

    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data)
      });

    socket.on('disconnect', function(socket){
      console.log("user disconnect");
    })
  })


// ----------------sports----------------
  sports.on('connection', function(socket){
    console.log('User connected', socket.id);

    socket.broadcast.emit('newUser', socket.id)

    socket.on('chat', function(data){
      sports.emit('chat', data)
    })

    socket.on('setUserName', function(name){
      socket.username = name
      console.log(name);
      sports.emit('newName', socket.id, socket.username);
    })

    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data)
      });

    socket.on('disconnect', function(){
      console.log("user disconnect");
      socket.broadcast.emit('userLeft', socket.username);
    })
  })



//   io.on('connection', function(socket){
//     console.log('a user connected', socket.id);
//
//   socket.on('disconnect', function(socket){
//     console.log("user disconnect");
//   })
//
// socket.on('chat', function(data){
//
//   io.sockets.emit('chat', data)
// })
//
// socket.on('typing', function(data){
//     socket.broadcast.emit('typing', data)
//   });
// });
