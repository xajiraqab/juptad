var express = require('express');
var app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var favicon = require('serve-favicon');
const path = require('path');
var cors = require('cors')
const getMovieFromUrl = require('./getMovieFromUrl')
const fs = require('fs')

const jSocketControl = require("./jsocketcontrol")
const { _listUsers, _rooms, _mapUsernameInRoom } = require("./db")


app.set('view engine', 'ejs')
app.use(cors())
app.use(express.json());
app.use(require('cookie-parser')())
app.use(favicon(path.join(__dirname, '', 'favicon.ico')))
app.use(express.static('public'))


const requireLogin = (req, res, next) => {
  if (!req.cookies.username) {
    res.sendFile(__dirname + '/public/login.html');
    return
  }
  next()
}

app.get('/robots.txt', (_, res) => res.send(''))

app.get('/', requireLogin, (req, res) => {
  res.render(__dirname + '/views/rooms.ejs', { username: req.cookies.username, listRooms: _rooms });
  // res.render(__dirname + '/views/index.ejs');
});


//ნინხნარებლის შემოწმება
app.post('/checkuser', (req, res) => {
  const username = req.body.username
  if (_listUsers.indexOf(username) !== -1)
    res.send({ status: 1 })
  else
    res.send({ status: -1 })
})


//შესვლის გვერდი
app.get('/login', (req, res) => {
  if (req.cookies.username) {
    res.render(__dirname + '/views/rooms.ejs', { username: req.cookies.username, listRooms: _rooms });
    return
  }
  res.sendFile(__dirname + '/public/login.html');
});


//შესვლა
app.post('/login', (req, res) => {
  const username = req.body.username

  if (_listUsers.indexOf(username) !== -1) {
    res.send({ status: -1, message: 'user already logged in' })
    return
  }

  _listUsers.push(username)
  res.send({ status: 1 })
})


//ოთახების ჩამონათვალი
app.get('/rooms', requireLogin, (req, res) => {
  res.render(__dirname + '/views/rooms.ejs', { username: req.cookies.username, listRooms: _rooms });
});


//ოთახის შექმნა
app.post('/createRoom', requireLogin, async (req, res) => {
  const movie = await getMovieFromUrl(req.body.url)
  if (movie.error) {
    res.send({ status: -1, message: movie.error })
    return
  }

  const roomName = _mapUsernameInRoom[req.cookies.username]
  _rooms[roomName].movie = movie
  _rooms[roomName].movie = movie
  _rooms[roomName].listUsers = []
  _rooms[roomName].providerUser = null
  _rooms[roomName].isPlaying = false
  _rooms[roomName].currentTime = 0.0
  res.send({ status: 1 })
})


//ოთახის შექმნა ექსთენშენიდან
app.post('/createRoomFE', (req, res) => {

  const movie = req.body.movieInfo

  const newRoomName = `j${Object.keys(_rooms).length + 1}`
  _rooms[newRoomName] = {
    movie: movie,
    listUsers: [],
    providerUser: null,
    isPlaying: false,
    currentTime: 0.0
  }


  res.send({ status: 1, url: `https://juptad.herokuapp.com/${newRoomName}` })
})



//ოთახის დაბრუნება
app.get('/:roomName', requireLogin, (req, res) => {
  const roomName = req.params.roomName
  if (!_rooms[roomName]) {
    res.status(404).send("room not found")
    return
  }

  _mapUsernameInRoom[req.cookies.username] = roomName

  if (!_rooms[roomName].movie) {
    res.render(__dirname + '/views/createRoom.ejs', { roomName })
    return
  }

  res.render(__dirname + '/views/room.ejs', {
    roomName,
    listEmojis: fs.readdirSync(__dirname + '/public/images/emojis'),
    movieTitle: _rooms[roomName].movie.title,
    username: req.cookies.username
  })
})




io.on('connection', socket => jSocketControl(io, socket));



server.listen(process.env.PORT || 5000, function () {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});


