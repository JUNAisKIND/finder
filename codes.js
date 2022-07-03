'use strict'
let songs;
fetch('https://junaiskind.github.io/finder/songs.json')
  .then(Response => Response.text())
  .then(text => songs = JSON.parse(text));

for(let button of document.querySelectorAll("main .search-options .option")) {
  button.addEventListener("click", (event) => {
  })
}

class afterText extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode : 'open'});
    this.shadowRoot.innerHTML = `<span></span><style>span::after {content: "${this.innerHTML}";}</style>`;
  }
}
customElements.define('af-t', afterText);

String.prototype.noSpaceLower = function() {
  return this.replaceAll(" ", "").toLowerCase();
}

function* getSongsContainsWith(text, admit) {
  for(let name in songs) {

    //text를 포함한 제목을 가진 songs yield
    if(name.noSpaceLower().includes(text.noSpaceLower()))
      for(let element of songs[name])
        if(admit.includes(element.type)) //admit 허용 목록에 포함된 songs
          yield [name, element]; //0: name, 1: song
  }
}

function returnScorebox(song) {

  const title = song["type"];
  const location = song["location"];
  const code = song["code"];
  const reference = song["reference"];

  const code_format = `<li class="code">${code}</li>`

  let song_title;
  switch (title) {
    case "ccm": song_title = `CCM ${location[0]}`; break;
    case "chan": song_title = "기쁨으로 찬양"; break;
    case "worshiper": song_title = "피아노 예배자 1"; break;
    case "code_rule": song_title = "찬송가 코드 반주법"; break;
    case "service": song_title = "찬송가 편곡집"; break;
    case "hymn": song_title = "새찬송가"; break;
    default: song_title = "Error";break;
  }

  let song_location;
  switch (title) {
    case "ccm": song_location = `p${location[1]}`; break;
    case "worshiper": song_location = `p${location[1]}`; break;
    case "hymn": song_location = `${location}장`; break;
    default: song_location = `p${location}`;break;
  }

  let song_code_list = "";
  if(code != null) {
    song_code_list = `<ui class="codebox">`
    for(let co of code) {
      song_code_list += `<li class="code"><af-t>${co}</af-t></li>`
    }
    song_code_list += "</ui>"
  }

  let song_reference = "";
  if(reference != null) {
    song_reference = `<section class="footer"><span class="reference"><af-t>${reference}</af-t></span></section>`;
  }
  

  return `
    <section class="head"><span class="title"><af-t>${song_title}</af-t></span><span class="location"><af-t>${song_location}</af-t></span>${song_code_list}</section>${song_reference}
    `
}

const input = document.querySelector("main .search-box input");
const checkboxes = document.querySelectorAll("main .search-options input");

function* filter(func, iter) {
  for(let value of iter)
    if(func(value)) yield value
}

function map(func, iter) {
  let lis = [];
  for(let value of iter)
    lis.push(func(value))
  return lis;
}

function update() {
  const search_result = document.querySelector("#search-result");

  if(input.value == "") {
    search_result.innerHTML = "검색결과가 없습니다.";
    return true;
  }

  const musicbox = document.querySelector("main .musicbox");

  musicbox.innerHTML = "";

  let admit = map(
    (value) => value.id, //return id
    filter((value) => value.checked, checkboxes) //checked 가 true인 checkbox
  );

  for(let element of getSongsContainsWith(input.value, admit)) {
    const newItem_div = document.createElement("div");
    const newItem_article = document.createElement("article");

    newItem_div.className = "titlebox";
    newItem_div.innerHTML = `<h3><af-t>${element[0]}</af-t></h3>`;
    newItem_article.innerHTML = returnScorebox(element[1]);;
    musicbox.appendChild(newItem_div);
    musicbox.appendChild(newItem_article);
  }

  const num = musicbox.getElementsByTagName("article").length;
  if(num == 0)
    search_result.innerHTML = "검색결과가 없습니다.";
  else
    search_result.innerHTML = `${num} 개의 악보가 있습니다.`;
}



input.addEventListener("keyup", update);
checkboxes.forEach((element) => {
  element.addEventListener("click", update);
});