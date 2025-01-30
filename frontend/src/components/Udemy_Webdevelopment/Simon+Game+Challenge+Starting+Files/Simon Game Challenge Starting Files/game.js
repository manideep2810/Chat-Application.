var buttonColors = ["red","blue","green","yellow"];

function setDefault(){
    gamePattern = [];
    userClickedPattern = [];
    level = -1;
    index = 0;
    started = false;
}

function playSound(randomChoosenColor){
    var audio = new Audio("./sounds/"+randomChoosenColor+".mp3");
    audio.play();
}

function nextSequence(){
    level++;
    $("#level-title").text("Level " + level);
    var randomNumber = Math.floor(Math.random()*4);
    var randomChoosenColor = buttonColors[randomNumber];
    gamePattern.push(randomChoosenColor);
    $("#"+randomChoosenColor).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    playSound(randomChoosenColor);
    // console.log("inside nextSequence + [ " + gamePattern + " ]");
}

function animatePress(color){
    $("#"+color).addClass("pressed");
    setTimeout(function(){
        $("#"+color).removeClass("pressed");
    },100);
}

function gameOver(){
    setDefault();
    $("#level-title").text("Game Over! Press any Key to Start Over");
    $("body").addClass("game-over");
    playSound("wrong");
    setTimeout(function(){
        $("body").removeClass("game-over");
    });
}

function gameLogic(){
    if(index === gamePattern.length-1){
        userClickedPattern = [];
        index = 0;
        setTimeout(function(){
            nextSequence();
        },1000);
        
    }else if(gamePattern[index] === userClickedPattern[index]){
        index++;
    }else{
        gameOver();
    }
}

function handelClick(color){
    $("#"+color).click(function(){
        userChoosenColor = color;
        userClickedPattern.push(userChoosenColor);
        // console.log("inside handleclick [ " + userClickedPattern + " ]");
        playSound(color);
        animatePress(color);
        gameLogic();
    });
}

function handelKeyStroke(){   
    document.addEventListener("keydown",function(event){
        nextSequence();
    });
}


setDefault();
handelClick("red");
handelClick("blue");
handelClick("green");
handelClick("yellow");
handelKeyStroke();
// nextSequence();


