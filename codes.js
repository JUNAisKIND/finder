ptag = document.querySelector("#ptag");
let songs;
fetch('https://junaiskind.github.io/finder/songs.json')
  .then(Response => Response.text())
  .then(text => songs = JSON.parse(text));