ptag = document.querySelector("#ptag")
let data = "{}"
fetch('https://junaiskind.github.io/finder/songs.json')
  .then(Response => Response.text())
  .then(text => data = text)

const songs = JSON.parse(data)
