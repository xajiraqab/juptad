const getMovieFromUrl = require('./getMovieFromUrl')
const { _listUsers, _rooms, _mapUsernameInRoom } = require("./db")

const getCookie = (socket, key) => {
  const cookie = socket.handshake.headers.cookie.split(";").find(cookie => cookie.trim().startsWith(key + '='))
  return cookie ? decodeURI(cookie.split("=")[1]) : null
}




const jSocketControl = (io, socket) => {

  //დაკავშირება
  socket.on('init', roomName => {

    const username = getCookie(socket, 'username');


    //თუ დალოგინებული არაა
    if (!username || !_rooms[roomName]) {
      socket.disconnect()
      return
    }


    //თუ მომხმარებლების სიაში არაა, ჩამატება (სერვერის თავიდან გაშვებისას, რომ შეავსოს)
    if (_listUsers.indexOf(username) === -1)
      _listUsers.push(username)


    //მომხმარებელი რომელ ოთახშიცაა მისი მიწერა
    if (!_mapUsernameInRoom[username])
      _mapUsernameInRoom[username] = roomName


    //თუ ოთახის მომხმარებლებში არაა, ჩამატება
    if (_rooms[roomName].listUsers.indexOf(username) === -1)
      _rooms[roomName].listUsers.push(username)


    //თუ პროვაიდერი არ მოიძებნა, მაშინ თითონ გახდება
    if (!_rooms[roomName].providerUser) {
      _rooms[roomName].providerUser = username
    }


    //ოთახში შესვლა
    socket.join(roomName)


    //ინფოს დასინკვა
    socket.emit('sync', _rooms[roomName])


    //სხვა მომხმარებლებზე გაგზავნა, რომ ეს შემოვიდა
    socket.broadcast.to(roomName).emit('userJoined', username);


    // console.log(username + " joined in ოთახში" + roomName)


    //გასვლა
    socket.on('disconnect', () => {

      // console.log('user disconnected', username);

      _mapUsernameInRoom[username] = undefined
      _rooms[roomName].listUsers = _rooms[roomName].listUsers.filter(u => u !== username)

      //თუ პროვაიდერია, სხვა მომხმარებლის გახდომა პროვაიდერად, ან თუ საერთოდ აღარვინ დარჩა, მაშინ null
      let newProvider = null
      if (_rooms[roomName].providerUser === username && _rooms[roomName].listUsers.length) {
        newProvider = _rooms[roomName].listUsers[0]
      }

      //თუ ყველა მომხმარებელი გავიდა, მაშინ ფილმის დაპაუზება
      if (!_rooms[roomName].listUsers.length) {
        _rooms[roomName].isPlaying = false
      }

      socket.leave(roomName)
      socket.broadcast.to(roomName).emit('userLeft', { username, newProvider });
    });


    //ემოჯის გაგზავნა
    socket.on('sendEmoji', url => {
      io.to(roomName).emit('sentEmoji', { url, username })
    })


    //გაგრძელება
    socket.on('videoContinued', data => {
      // console.log('continued', data, roomName)

      _rooms[roomName].isPlaying = true
      _rooms[roomName].currentTime = data.currentTime
      socket.broadcast.to(roomName).emit('videoContinued', { username, currentTime: data.currentTime });
    })


    //დაპაუზება
    socket.on('videoPaused', data => {
      // console.log('paused', data)

      _rooms[roomName].isPlaying = false
      _rooms[roomName].currentTime = data.currentTime
      socket.broadcast.to(roomName).emit('videoPaused', { username, currentTime: data.currentTime });
    })


    //დროის სვლა
    socket.on('videoCurrentTimeChanged', data => {
      _rooms[roomName].currentTime = data.currentTime
    })


    //ფილმის შეცვლა
    socket.on('changeMovie', async data => {

      const movie = await getMovieFromUrl(data)
      if (movie.error) {
        socket.emit('changingMovieError', movie.error)
        return
      }

      _rooms[roomName].movie = movie
      _rooms[roomName].listUsers = []
      _rooms[roomName].providerUser = null
      _rooms[roomName].isPlaying = false
      _rooms[roomName].currentTime = 0.0

      io.to(roomName).emit('refreshPage')
    })
  })
}








module.exports = jSocketControl