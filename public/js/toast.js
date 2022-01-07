//ტოსტები
let currentToast = null
let toastTimeout = null

const toast = text => {
  const div = document.createElement("div")
  div.style.left = "10px"
  div.style.bottom = "10px"
  div.style.background = "rgba(0, 0, 0, 0.8)"
  div.classList.add("floating")

  //მომხმარებლის სახელი
  const h3 = document.createElement("h3")
  h3.innerText = text
  h3.style.maxWidth = "calc(100vw - 20px)"
  h3.style.margin = "0"
  div.appendChild(h3)

  document.body.appendChild(div)

  if (toastTimeout) clearTimeout(toastTimeout)
  if (currentToast) currentToast.remove()

  currentToast = div
  toastTimeout = setTimeout(() => {
    clearTimeout(toastTimeout)
    currentToast.remove()
  }, 2000);
}