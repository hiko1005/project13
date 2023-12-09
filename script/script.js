let responceObject = {};
let responceApiObject = {};
let root = document.querySelector("#root");
let prev = document.querySelector("#prev");
let next = document.querySelector("#next");

function HandleResponce(responce) {
  responceObject = responce;
  navControll(responce.pagination);
  contentControll(responce.data);
}

function navControll(info) {
  if (info.next_url != undefined && info.next_url != null) {
    next.removeAttribute("hidden");
    next.setAttribute("url", info.next_url);
  } else {
    next.setAttribute("hidden");
  }
  if (info.prev_url != undefined && info.prev_url != null) {
    prev.removeAttribute("hidden");
    prev.setAttribute("url", info.prev_url);
  } else {
    prev.setAttribute("hidden", "hidden");
  }
}

function createPattern() {
  let pattern = `
    <p class="m-2">{{artist_display}}</p>
    <p class="m-2">{{place_of_origin}}</p>
    <p class="m-2">{{publication_history}}</p>
    <p class="m-2">{{description}}</p>
    <p class="m-2">{{exhibition_history}}</p>
    <p class="m-2">{{copyright_notice}}</p>
    <button class="m-2 btn btn-primary api_btn" id="show_all" url="{{api_link}}" onclick="openApiLink(event)">Show all</button>
    `;
  return pattern;
}

// ----------------------------

function openApiLink(event) {
  root.innerHTML = "";
  let url = event.target.getAttribute("url");
  parseApiLink(url);
}

function HandleResponce2(responce) {
  responceApiObject = responce;
  showFullContent(responce.data);
}

function showFullContent(content) {
  let div_ = document.createElement("div");
  div_.classList.add("p-2")
  div_.classList.add("card")
  Object.keys(content).forEach((key) => {
    if (
      content[key] != null &&
      content[key] != undefined &&
      content[key] != "" &&
      content[key]
    ) {
      let p_ = document.createElement("p");
      p_.innerText = content[key];
      div_.appendChild(p_);
    }
  });
  root.appendChild(div_);
}

function parseApiLink(url) {
  xhr = new XMLHttpRequest();
  xhr.onloadend = () => {
    if (xhr.status == 200) {
      HandleResponce2(JSON.parse(xhr.responseText));
    }
  };

  xhr.open("GET", url);
  xhr.send();
}

// ----------------------------

function createContentItem(item) {
  let div = document.createElement("div");
  div.classList.add("card");

  let div_ = createPattern();

  Object.keys(item).forEach((key) => {
    div_ = div_.replace("{{" + key + "}}", item[key] ?? "");
  });
  let info = document.createElement("div");
  info.innerHTML = div_;
  div.appendChild(info);
  root.appendChild(div);
}

function doRequest(url) {
  xhr = new XMLHttpRequest();
  xhr.onloadend = () => {
    if (xhr.status == 200) {
      HandleResponce(JSON.parse(xhr.responseText));
    }
  };

  xhr.open("GET", url);
  xhr.send();
}

function contentControll(content) {
  root.innerHTML = "";
  content.forEach((item) => createContentItem(item));
}

function navHandleClick(e) {
  doRequest(e.target.getAttribute("url"));
}

document.querySelector("#btn").addEventListener("click", (e) => {
  e.preventDefault();
  navHandleClick(e);
  // doRequest("https://api.artic.edu/api/v1/artworks");
});

document
  .querySelector("#prev")
  .addEventListener("click", (e) => navHandleClick(e));
document
  .querySelector("#next")
  .addEventListener("click", (e) => navHandleClick(e));
