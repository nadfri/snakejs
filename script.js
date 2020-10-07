"use strict";
/*********************CANVAS********************************************/
const ctx = canvas.getContext("2d");
const width   = 700;
const height  = 600;
canvas.width  = width;
canvas.height = height;
const block = 20;

/*******************initial Value**************************************/
let direction       = "left";
let oldDirection    = "horizontal";
let stopAnimation   = false;
let collision       = false;
let score           = 0;
let highScore       = (localStorage.getItem("highScore"))? localStorage.getItem("highScore") : "000";
scoreID.textContent = highScore;
let animation;


/******************************AUDIOS***********************************/
let play       = false;
let once       = true;
let music      = new Audio("music/mix.mp3");
let glup       = new Audio("music/glup.mp3"); 
let lost       = new Audio("music/lost.mp3");
let newRecord  = new Audio("music/newRecord.mp3"); 
const tabAudio = [music,glup,lost,newRecord];
let soundActive;
speakerControl();

/**************************CLASS***************************************/
class Shape
{
    constructor (posX,posY,color)
    {
        this.posX   = posX;		
        this.posY   = posY;
        this.color  = color;
    }

    drawCircle()
    {
        ctx.shadowBlur    = 5; //shadow activé sur tous les dessins
        ctx.shadowColor   = "#363636";

        ctx.beginPath();
        ctx.arc(this.posX*block+block/2,this.posY*block+block/2,block/2,0, Math.PI*2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = "green";
        ctx.stroke();
    }

    drawRect()
    {
        ctx.beginPath();
        ctx.rect(this.posX*block,this.posY*block,block,block);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    
}

/****************Creation of Apple and The Snake *****************************/
const randomize = (max) => Math.floor(Math.random()*(max/block));

const pomme = new Shape(randomize(width),randomize(height),"greenYellow");
const snake = [new Shape(20,15,"gold"),new Shape(21,15,"black"),new Shape(22,15,"black"),];
pomme.drawCircle(); //draw apple
updateDirection(snake); //draw snake at new position

/*******************Launch The Game********************************************/
launchGame();

/*******************Animation of the Game*************************************/
function motion()
{
    ctx.clearRect(0, 0, width, height); //clear canvas
    pomme.drawCircle();
    detectCollision(snake);
    snakeControl();
    eat(snake,pomme);
    updateDirection(snake);
    scoreDisplay(score);

    setTimeout(()=>{if(stopAnimation == false) 
    animation = requestAnimationFrame(motion)},90);
    gameOver();
} 

/****************************Launch the Game***********************************/
function launchGame()
{
    onkeypress = (e) =>
    {
        if(e.key == " " && play == false) //launch by press bar space
        {
            play = true;
            info.textContent = "";
            animation = requestAnimationFrame(motion);
            music.play();
        }
    };
}

/*******************************Function PAUSE**********************/
function gamePause()
{ 
    if(stopAnimation == false && play == true)
    {
        info.textContent = "***GAME IS PAUSED***";
        stopAnimation = true;
        console. log('stopAnimation:', stopAnimation)
        drawMessage("PAUSE");
        cancelAnimationFrame(animation); //Freeze Animation
        keyP.src = "img/KeyPDown.png";
        music.pause();
    }
 
    else if (stopAnimation == true && play == true)
    {
        info.textContent = "";
        stopAnimation = false;
        requestAnimationFrame(motion);
        keyP.src = "img/KeyP.png";
        music.play();
    }          
} 

/***************Snake Control****************************************/
function snakeControl()
{
    const arrow = {
        "ArrowRight": "right",
        "ArrowLeft" : "left",
        "ArrowUp"   : "up" ,
        "ArrowDown" : "down",
    }

    const keyImgUp = {
        "ArrowRight": "img/RightArrow.png",
        "ArrowLeft" : "img/LeftArrow.png",
        "ArrowUp"   : "img/UpArrow.png" ,
        "ArrowDown" : "img/DownArrow.png",
    }

    const keyImgDown = {
        "ArrowRight": "img/RightArrowDown.png",
        "ArrowLeft" : "img/LeftArrowDown.png",
        "ArrowUp"   : "img/UpArrowDown.png" ,
        "ArrowDown" : "img/DownArrowDown.png",
    }

    const opposedKey = {
        "ArrowRight": "horizontal",
        "ArrowLeft" : "horizontal",
        "ArrowUp"   : "vertical" ,
        "ArrowDown" : "vertical",
    }

    //sur tout le document
    onkeydown = (e) => {
        if(e.key in arrow) 
        {
            if(opposedKey[e.key] != oldDirection) 
            {
                direction = arrow[e.key];
                console.log('direction:', direction)
                oldDirection = opposedKey[e.key];
                document.getElementById(arrow[e.key]).src = keyImgDown[e.key];
            }

            
        }

        if(e.key == "p") gamePause();
    };

    onkeyup = (e) => {
        if(e.key in arrow) document.getElementById(arrow[e.key]).src = keyImgUp[e.key];
    };
}
/***************Snake Direction****************************************/
function updateDirection(snake)
{
    for(let i=snake.length-1; i>0;i--)
    {
        snake[i].posX = snake[i-1].posX;
        snake[i].posY = snake[i-1].posY;
    }

    if     (direction == "left")  snake[0].posX-=1;
    else if(direction == "right") snake[0].posX+=1;
    else if(direction == "up")    snake[0].posY-=1;
    else if(direction == "down")  snake[0].posY+=1;

    if(collision) for(let element of snake) element.color= "red";

    for(let element of snake) element.drawRect();//draw new snake position

}

/***************Snake eats apple****************************************/
function eat(snake,pomme)
{
    if(snake[0].posX == pomme.posX && snake[0].posY == pomme.posY)
    {
        score++;
        newHiScore(score);
        glup.play();
        snake.push(new Shape(null,null,"gray"));
        setTimeout(()=>snake[snake.length-1].color = "black",500);
        pomme.posX = randomize(width);
        pomme.posY = randomize(height);
    }
}

/*******************************Function Collision and Game Over**********************/
function detectCollision(snake)
{
    const tail = snake.slice(1);
    let selfCollision;

    for (let element of tail)
        if(snake[0].posX == element.posX && snake[0].posY == element.posY )
            selfCollision = true;


    if(snake[0].posX < 0 || snake[0].posX >= width/block  ||
       snake[0].posY < 0 || snake[0].posY >= height/block || selfCollision)
        collision = true;
}

function gameOver()
{
    if(collision)
    {
        drawMessage("GAME OVER");
        stopAnimation = true;
        play = false;
        cancelAnimationFrame(animation);
        info.textContent = "Press Space Bar to play again";
        music.pause();
        lost.play();

        document.onkeypress = (e) => {
        if(e.key == " ") document.location.reload();};
    }  
}

/*******************************Function Message in Canvas**********************/
function drawMessage(text)
{
    ctx.shadowBlur    = 10;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    ctx.shadowColor   = "#363636";
    
    ctx.fillStyle = "blue";
    ctx.font = "70px orbitron";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(text,width/2,height/2);
    ctx.strokeStyle = "red";
    ctx.strokeText(text,width/2,height/2);
}

/*****************************Sound Control****************************/
function mute()
{
    if(soundActive == 1)
    {
        soundActive = 0;
        speaker.textContent = "🔈";
        for (let audio of tabAudio) audio.muted = true;
    }

    else
    {
        soundActive = 1;
        speaker.textContent = "🔊";
        for (let audio of tabAudio) audio.muted = false;
    }

    localStorage.setItem("saveMute", soundActive); //save data sound
}

function speakerControl()
{
    speaker.onclick = mute;

    let getStorage  = localStorage.getItem('saveMute'); //verify if data in storage
    soundActive = (getStorage != null)? getStorage : 1;

    if(soundActive == 0)
    {
        soundActive = 1;
        mute();
    }
}

/***************Score Display and HighScore*********************************************/
function scoreDisplay(score)
{
    ctx.shadowBlur    = 2;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowColor   = "#363636";
    
    ctx.fillStyle = "indianred";
    ctx.font = "18px orbitron";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(`Score: ${score}`,width-130,4);
}

function newHiScore(score)
{
    if(score > highScore && once)
    {
        newRecord.play();
        info.textContent = "New Record !!!";
        localStorage.setItem("highScore",score);
        once = false;
    }

    else if ( score > highScore && !once)
    {
        localStorage.setItem("highScore",score);
    }
}