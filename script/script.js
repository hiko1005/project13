let responceObject = {}
let root = document.querySelector("#root")

function HandleResponce(responce) {
    responceObject = responce;
    navControll(responce.pagination)
    contentControll(responce.data)
}

function navControll(info) {
    let prev = document.querySelector("#prev");
    let next = document.querySelector("#next");

    if(info.next_url != undefined && info.next_url != null) {
        next.removeAttribute("hidden");
        next.setAttribute("url", info.next_url)
    } else {
        next.setAttribute("hidden");
    }
    if(info.prev_url != undefined && info.prev_url != null) {
        prev.removeAttribute("hidden");
        prev.setAttribute("url", info.prev_url)
    } else {
        prev.setAttribute("hidden", "hidden");
    }
}

function createContentItem(item) {
    let div =  document.createElement("div");
    div.classList.add("card");

    let displayAttributes = ['artist_display', 'place_of_origin']

    Object.keys(item).forEach(key => {
        if(displayAttributes.includes(key)) {
        let p = document.createElement("p");
        p.innerText = item[key];
        div.appendChild(p);
        }
    })


    root.appendChild(div)
}

function doRequest(url) {
    xhr = new XMLHttpRequest();
    xhr.onloadend = () => {
        if (xhr.status == 200) {
            HandleResponce(JSON.parse(xhr.responseText));
        }
    }

    xhr.open("GET", url);
    xhr.send();
}

function contentControll(content) {
    root.innerHTML = "";
    content.forEach(item => createContentItem(item));
}

function navHandleClick(e) {
    doRequest(e.target.getAttribute("url"))
}

document.querySelector("#btn").addEventListener("click", (e) => {
    e.preventDefault();
    navHandleClick(e)
    // doRequest("https://api.artic.edu/api/v1/artworks");
})

document.querySelector("#prev").addEventListener("click", (e) => navHandleClick(e))
document.querySelector("#next").addEventListener("click", (e) => navHandleClick(e))
