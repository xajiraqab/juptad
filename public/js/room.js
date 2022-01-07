const ui = {
  lblMovieTitle: document.querySelector("#title"),
  lblMovieDescription: document.querySelector("#description"),
  imgMoviePoster: document.querySelector("#poster"),
  btnJoin: document.querySelector("#btnJoin"),
  btnChangeMovie: document.querySelector("#btnChangeMovie"),
  btnFullscreen: document.querySelector("#btnFullscreen"),
  txtMovieUrl: document.querySelector("#txtMovieUrl"),
  video: document.querySelector("video"),
  cUsers: document.querySelector("#users"),
  cVideo: document.querySelector(".videoContainer"),
  cMain: document.querySelector("main"),
  cModalJoin: document.querySelector("#dlgJoin"),
  cModalChangeMovie: document.querySelector("#dlgChangeMovie"),
  cFormChangeMovie: document.querySelector("#dlgChangeMovie form"),
  cEmojis: document.querySelector(".emojis"),
  cFlotingEmojis: document.querySelector("#floatingEmojisContainer"),
  formChangeMovie: document.querySelector("form"),
  loading: document.querySelector(".loading"),


  //დაბლოკვა, რომ გაგრძელება ვერ შეძლოს - თუ სხვა მომხმარებელმა დააპაუზა, მარტო მას შეეძლება გაგრძელება
  funBlockMovie: (pauserUsername) => {
    //#??? დასამატებელია
  },

  //ბლოკის მოხსნა
  funReleaseMovie: () => {
    //#??? დასამატებელია
  },


  funShowModalChangeMovie: () => {
    ui.cMain.style.opacity = 0
    ui.cVideo.style.opacity = 0
    ui.cFlotingEmojis.style.opacity = 0
    ui.cModalChangeMovie.style.opacity = 0
    ui.cModalChangeMovie.style.display = "block"
    ui.btnFullscreen.style.opacity = 0
    setTimeout(() => ui.cModalChangeMovie.style.opacity = 1, 10);
    ui.txtMovieUrl.focus()
  },

  funHideModalChangeMovie: () => {
    if (bIsLoading) return
    ui.cMain.style.opacity = 1
    ui.cVideo.style.opacity = 1
    ui.cFlotingEmojis.style.opacity = 1
    ui.cModalChangeMovie.style.opacity = 0
    ui.btnFullscreen.style.opacity = 1
    setTimeout(() => { ui.cModalChangeMovie.style.display = "none"; ui.txtMovieUrl.value = "" }, 450);
  },

  funShowEmoji: (data) => {

    const index = listUsers.findIndex(u => u.username === data.username)
    if (index === -1) return

    soundEmoji.currentTime = 0
    soundEmoji.play()

    const div = document.createElement("div")
    div.style.left = random(0, window.innerWidth - 210) + "px"
    div.style.top = random(0, window.innerHeight - 128) + "px"
    div.classList.add("floating")

    //მომხმარებლის სახელი
    const h3 = document.createElement("h3")
    h3.innerText = data.username

    //ემოჯი
    const img = document.createElement("img");
    img.src = data.url

    //გამოჩენა
    div.appendChild(h3)
    div.appendChild(img)
    ui.cFlotingEmojis.appendChild(div)

    //თუ ამ მომხმარებლის ემოჯი უკვე ჩანს, ძველის გაქრობა
    if (listUsers[index].divEmoji)
      listUsers[index].divEmoji.remove()

    //თუ ძველი ემოჯის წაშლამდე დარჩენილი დრო მიმდინარეობს, გაუქმება
    if (listUsers[index].timerEmoji)
      clearTimeout(listUsers[index].timerEmoji)

    listUsers[index].divEmoji = div

    //წაშლის დროის ჩართვა
    listUsers[index].timerEmoji = setTimeout(() => {
      div.remove()

    }, 3000);

  }
}


let listUsers = [] // { username, divEmoji, timerEmoji }
let bIsProvider = false
let currentTime = null
let bChangedByUser = true //მომხმარებელმა დააპაუზა/გააგრძელა ვიდეო თუ სხვა ვინმემ. თუ მომხმარებელმა მაშინ სხვებს დაეგზავნება შესაბამისი ნამოქმედარი
let bIsLoading = false
let bFirstTimeInit = true
let soundEmoji = new Audio("/sounds/notification.mp3")


const random = (a, b) => Math.floor(Math.random() * (b - a + 1) + a)


//მომხმარებლების სიის მიხედვით, შემოსულების განახლება
const updateUsers = () => {
  let html = "<h2>"
  listUsers.forEach(u => {
    html += u.username.substring(0, 10) + (u.username.length > 10 ? ".." : "") + ", "
  })
  ui.cUsers.innerHTML = html.substring(0, html.length - 2) + "</h2>";
}


//ფილმის ინფოს ჩვენება
const setMovie = (movie) => {
  if (!movie) {
    ui.imgMoviePoster.style.visibility = 'hidden'
    return
  }
  ui.imgMoviePoster.style.visibility = 'visible'
  ui.video.setAttribute("src", movie.src)
  ui.imgMoviePoster.setAttribute("src", movie.image)
  ui.lblMovieDescription.innerText = movie.description
  ui.lblMovieTitle.innerText = movie.title
}


//ოთახში შესვლა
ui.btnJoin.addEventListener("click", () => {

  ui.cMain.style.opacity = 1
  ui.cVideo.style.opacity = 1
  ui.cFlotingEmojis.style.opacity = 1
  ui.cModalJoin.style.display = 'none'
  window.scrollTo(0, 0);

  //დაკავშირება და ინფოს წამოღება
  const socket = io();
  socket.on("connect", () => {

    socket.emit('init', roomName)

    socket.on("sync", (data) => {
      setMovie(data.movie)
      listUsers = data.listUsers.map(name => ({ username: name, divEmoji: null, timerEmoji: null }))

      bIsProvider = data.providerUser === user.username

      ui.video.currentTime = data.currentTime
      if (data.isPlaying) {
        bChangedByUser = true
        ui.video.play()
      }

      updateUsers()
    });
  });


  //ფილმის შეცვლა
  ui.formChangeMovie.addEventListener("submit", e => {
    e.preventDefault()
    if (bIsLoading) return

    bIsLoading = true
    ui.loading.style.visibility = 'visible'
    socket.emit('changeMovie', ui.txtMovieUrl.value)
  })


  //თუ ახალი ფილმის დამატებისას მოხდა შეცდომა
  socket.on('changingMovieError', (error) => {
    bIsLoading = false
    ui.loading.style.visibility = 'hidden'
    alert(error)
  })


  //გვერდის თავიდან გახსნა, თუ ფილმი შეიცვალა მაშინ მოვა ეს
  socket.on('refreshPage', () => window.location.reload())


  //ემოჯის გაგზავნა
  if (bFirstTimeInit) {
    const listEmojis = document.querySelectorAll(".emojis button");

    listEmojis.forEach(btn => btn.addEventListener("click", (e) => {
      let emojiName = (e.target.src || e.target.firstChild.src).split("/").pop()
      socket.emit('sendEmoji', "/images/emojis/" + emojiName)
    }))

    bFirstTimeInit = false
  }


  //ემოჯის მიღება
  socket.on('sentEmoji', data => ui.funShowEmoji(data))


  //მომხმარებელი შემოერთდა
  socket.on('userJoined', (username) => {
    if (listUsers.some(u => u.username === username)) return
    listUsers.push({ username })
    toast(`🖐 ${username} joined`)
    updateUsers()
  });


  //მომხმარებელმა გაერთდა
  socket.on('userLeft', ({ username, newProvider }) => {
    const index = listUsers.findIndex(u => u.username === username)
    if (index === -1) return

    //ემოჯის გასუფთავება
    if (listUsers[index].divEmoji)
      listUsers[index].divEmoji.remove()

    //ემოჯის გასუფთავების გასუფთავება
    if (listUsers[index].timerEmoji)
      clearTimeout(listUsers[index].timerEmoji)

    listUsers = listUsers.filter(u => u.username !== username)
    updateUsers()

    //თუ თავად გახდა ახალი პროვაიდერი
    if (newProvider === user.username) {
      bIsProvider = true
    }

    toast(`👎 ${username} left`)
  });


  //ვიდეო გაგრძელდა
  socket.on('videoContinued', (data) => {
    bChangedByUser = false
    ui.video.currentTime = data.currentTime
    ui.video.play()
    toast(`🟢 ${data.username} Continued Moive`)
  });


  //ვიდეო დაპაუზდა
  socket.on('videoPaused', (data) => {
    bChangedByUser = false
    ui.video.currentTime = data.currentTime
    ui.video.pause()
    toast(`🔴 ${data.username} Paused Moive`)
  });


  //გაგრძელება
  ui.video.onplaying = () => {
    if (!bChangedByUser) {
      bChangedByUser = true
      return
    }
    socket.emit('videoContinued', { user, currentTime: ui.video.currentTime });
  };


  //დაპაუზება
  ui.video.onpause = () => {
    if (!bChangedByUser) {
      bChangedByUser = true
      return
    }
    socket.emit('videoPaused', { user, currentTime: ui.video.currentTime });
  };


  //ყოველ 5 წამში სოკეტზე გაგზავნა დროის
  setInterval(() => {
    if (ui.video.paused || !bIsProvider) return
    socket.emit('videoCurrentTimeChanged', { user, currentTime: ui.video.currentTime });
  }, 3500)

})


//ფილმის შეცვლის დიალოგის დახურვა, ცარიელ ადგილზე დაჭერისას
ui.cModalChangeMovie.addEventListener("click", e => {
  if (e.target !== ui.cModalChangeMovie) return
  ui.funHideModalChangeMovie()
})


//ფილმის შეცვლის დიალოგის გახსნა
ui.btnChangeMovie.addEventListener("click", () => ui.funShowModalChangeMovie())


//მთელ ეკრანზე გაშლა/დახურვა
let bIsFullscreen = false
ui.btnFullscreen.addEventListener("click", e => {

  bIsFullscreen = !bIsFullscreen

  if (bIsFullscreen) {
    document.body.requestFullscreen()
    screen.orientation.lock('landscape').catch(() => { })
  }
  else {
    document.exitFullscreen()
    screen.orientation.unlock()
  }

  ui.btnFullscreen.innerText = bIsFullscreen ? "Exit Fullscreen" : "Fullscreen"
})


//ვიდეოზე დაჭერისას ჩართვა/დაპაუზება
ui.video.addEventListener("click", () => {
  if (ui.video.readyState !== 4) return

  if (!ui.video.paused) {
    ui.video.pause()
  }
  else {
    ui.video.play()
  }

})