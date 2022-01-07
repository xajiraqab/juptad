const cookies = {


  //დაბრუნება
  getItem: key => {
    const cookie = document.cookie.split(";").find(cookie => cookie.trim().startsWith(key + '='))
    return cookie ? cookie.split("=")[1] : null
  },


  //დამატება
  setItem: (key, value) => {
    const d = new Date();
    d.setTime(d.getTime() + (100 * 24 * 60 * 60 * 1000));
    document.cookie = encodeURI(`${key}=${value};expires=${d.toUTCString()};path=/`)
  },


  //წაშლა
  removeItem: key => {
    document.cookie = key + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT"
  }
}