const ui = {
  btnProcess: document.querySelector("button"),
}



function getMovieInfo() {

  let movieInfo = {
    title: "",
    description: "",
    image: "",
    src: "",
  }

  switch (window.location.host) {
    case "www.imovies.cc":
      movieInfo = {
        // title: tab.title,
        description: document.querySelector(".movie-description").innerText,
        image: document.querySelector(".movie-poster img").src,
        src: document.querySelector(".vjs-tech").src,
      }
      break;
    case "www.adjaranet.com":
      movieInfo = {
        // title: tab.title,
        description: document.querySelector(".caraxv") ? document.querySelector(".caraxv").innerText : '',
        image: document.querySelector("div[poster]").getAttribute("poster"),
        src: document.querySelector(".vjs-tech").src,
      }
      break;
    default:
      movieInfo.error = "website not supported";
      break;
  }

  return movieInfo;
}





const createRoomForMovie = (tab, data) => {
  
  const movieInfo = {
    title: tab.title,
    ...data[0].result
  }

  if (movieInfo.error) {
    alert(movieInfo.error)
    ui.btnProcess.innerText = "create"
    ui.btnProcess.classList.toggle("disabled")
    return
  }


  fetch('https://juptad.herokuapp.com/createRoomFE', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ movieInfo }),
  })
  .then(response => response.json())
  .then(data => {
    chrome.tabs.create({ url: data.url });
    // ui.btnProcess.classList.toggle("disabled")
  })
  .catch((error) => {
    alert('Error Occured!')
    ui.btnProcess.classList.toggle("disabled")
    ui.btnProcess.innerText = "create"
  });

}



ui.btnProcess.addEventListener('click', () => {

  ui.btnProcess.innerText = "loading.."
  ui.btnProcess.classList.toggle("disabled")

  chrome.tabs.query({ active: true }, function (tabs) {
    let tab = tabs[0];

    chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      func: getMovieInfo,
    }, (data) => createRoomForMovie(tab, data));
  });


})