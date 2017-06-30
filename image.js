"use strict";


let galleryUrl = "http://www.bing.com/gallery";
let target = "http://az619822.vo.msecnd.net/files/VeniceSunset_EN-US9661879063_1920x1200.jpg";

function setBackgroundImage(url) {
    let urlString = `url(${url})`;
    document.querySelector("html").style.backgroundImage = urlString;
}

let blacklist = {
    "defaultBlacklistedItem": true
};

function selectImageName() {
    // pick a random image not in the blacklist
    let name = "defaultBlacklistedItem"
    while (blacklist[name] == true) {
        name = imageNames[Math.floor(Math.random() * imageNames.length)];
    }
    return name;
}

function imageNameToUrl(name) {
    return `http://az619822.vo.msecnd.net/files/${name}_1920x1200.jpg`;
}

function httpGetAsync(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () => callback(xmlHttp);
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}

function imageExists(url, callback) {
    httpGetAsync(url, (res) => {
        return callback(res.status !== 404);
    })
}

function setImage(callback) {
    let imageName = selectImageName();
    let url = imageNameToUrl(imageName);
    // let url = "http://az619822.vo.msecnd.net/files/UnknownSoldierGuard_EN-US9122676841_1920x1200.jpg";
    console.log(url);

    // test if the image is valid
    imageExists(url, (exists) => {
        if (exists) {
            setBackgroundImage(url);
            return callback(null);
        } else {
            return callback(true);
        }
    });
}

let attempt = 0;
let maxAttempts = 4;
let timeout = 100;
function retryAttempt() {
    setImage((err) => {
        if (err && attempt++ < maxAttempts) {
            setTimeout(retryAttempt, timeout);
        }
    });
}

window.onload = function () {
    retryAttempt();
}