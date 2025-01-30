var drum = document.querySelectorAll(".drum");

drum[0].addEventListener("click",function () {
    var audio0 = new Audio("./sounds/tom-1.mp3");
    audio0.play();
})

drum[1].addEventListener("click",function () {
    var audio1 = new Audio("./sounds/tom-2.mp3");
    audio1.play();
})

drum[2].addEventListener("click",function () {
    var audio2 = new Audio("./sounds/tom-3.mp3");
    audio2.play();
})

drum[3].addEventListener("click",function () {
    var audio3 = new Audio("./sounds/tom-4.mp3");
    audio3.play();
})

drum[4].addEventListener("click",function () {
    var audio4 = new Audio("./sounds/snare.mp3");
    audio4.play();
})

drum[5].addEventListener("click",function () {
    var audio5 = new Audio("./sounds/kick-bass.mp3");
    audio5.play();
})

drum[6].addEventListener("click",function () {
    var audio6 = new Audio("./sounds/crash.mp3");
    audio6.play();
})


document.addEventListener("keydown",function (event) {
    if(event.key === "w"){
        var audio0 = new Audio("./sounds/tom-1.mp3");
        audio0.play();
    }
})

document.addEventListener("keydown",function (event) {
    if(event.key === "a"){
        var audio1 = new Audio("./sounds/tom-2.mp3");
        audio1.play();
    }
})

document.addEventListener("keydown",function (event) {
    if(event.key === "s"){
        var audio2 = new Audio("./sounds/tom-3.mp3");
        audio2.play();
    }
})

document.addEventListener("keydown",function (event) {
    if(event.key === "d"){
        var audio3 = new Audio("./sounds/tom-4.mp3");
        audio3.play();
    }
})

document.addEventListener("keydown",function (event) {
    if(event.key === "j"){
        var audio4 = new Audio("./sounds/snare.mp3");
        audio4.play();
    }
})

document.addEventListener("keydown",function (event) {
    if(event.key === "k"){
        var audio5 = new Audio("./sounds/kick-bass.mp3");
        audio5.play();
    }
})

document.addEventListener("keydown",function (event) {
    if(event.key === "l"){
        var audio6 = new Audio("./sounds/crash.mp3");
        audio6.play();
    }
})



