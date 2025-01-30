var randomNumber1 = Math.floor(Math.random()*6) + 1;
var randomNumber2 = Math.floor(Math.random()*6) + 1;
var dice1 = "./images/dice";
dice1 = (dice1 + randomNumber1 + ".png");
var dice2 = "./images/dice";
dice2 = (dice2 + randomNumber2 + ".png");
var p1 = document.getElementsByClassName("img1")[0];
var p2 = document.getElementsByClassName("img2")[0];
p1.setAttribute("src",dice1);
p2.setAttribute("src",dice2);
var res = document.querySelector("h1");

var wonplayer = 1;
if(randomNumber1 < randomNumber2){
    wonplayer = 2;
}else if(randomNumber1 === randomNumber2){
    wonplayer = 0;
}


var result ;
if(wonplayer!==0)   result =  "Player " + wonplayer + " won!";
else result = "Draw!";


setTimeout(()=>{
    res.innerHTML = "Refresh Me";
},3000)

res.innerHTML = result;
