"use strict";
/*********************CANVAS********************************************/
const ctx     = canvas.getContext("2d");
const width   = 760;
const height  = 460;
canvas.width  = width;
canvas.height = height;
const block   = 20;

/*******************initial Value**************************************/
let direction       = "left";
let oldDirection    = "left";
let stopAnimation   = false;
let collision       = false;
let fired           = false;
let play            = false;
let once            = true;
let score           = 0;
let speed           = 100;
let highScore       = localStorage.getItem("highScore") || "000";
scoreID.textContent = highScore;
let animation;

/******************************AUDIOS***********************************/
let music      = new Audio("music/mix.mp3");
let glup       = new Audio("music/glup.mp3"); 
let lost       = new Audio("music/lost.mp3");
let newRecord  = new Audio("music/newRecord.mp3"); 
const tabAudio = [music,glup,lost,newRecord];
mute(localStorage.getItem("sound"));

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
for(let element of snake) element.drawRect(); //draw snake

/**************************Run The Game********************************************/
scoreDisplay(score);
launchGame();

/*************************Animation of the Game*************************************/
function motion()
{
    ctx.clearRect(0, 0, width, height); //clear canvas
    pomme.drawCircle();
    snakeControl();
    newDirection(snake);
    detectCollision(snake);
    eat(snake,pomme);
    scoreDisplay(score);

    setTimeout(()=>{if(stopAnimation == false) 
    animation = requestAnimationFrame(motion)},speed);
    gameOver();
} 

/****************************Launch the Game***********************************/
function launchGame()
{
    onkeypress = (e) =>
    {
        if(e.key == " " && play == false) //launch by press bar space
        {
            play             = true;
            info.textContent = "";
            animation        = requestAnimationFrame(motion);
            music.loop       = true;
            music.play(); 
        }
        e.preventDefault(); //prevent scroll bar
    };
}

/*******************************Function PAUSE**********************/
function gamePause()
{ 
    if(stopAnimation == false && play == true)
    {
        info.textContent = "***GAME IS PAUSED***";
        stopAnimation    = true;
        keyP.src         = "img/KeyPDown.png";
        drawMessage("PAUSE");
        music.pause();
        cancelAnimationFrame(animation); //Freeze Animation
    }
 
    else if(stopAnimation == true && play == true)
    {
        info.textContent = "";
        stopAnimation    = false;
        keyP.src         = "img/KeyP.png";
        music.play();
        requestAnimationFrame(motion);
    }          
} 

/***************Snake Control****************************************/
function snakeControl()
{
    onkeydown = (e) =>{
        if(e.key == "p") gamePause();

        if(fired == false) //new move only if precedent move is over
        {
            if((e.key == "ArrowRight" || e.key == "d") && oldDirection != "left")
            {
                direction    = "right";
                keyRight.src = "img/RightArrowDown.png";
                keyD.src = "img/KeyDDown.png";
                e.preventDefault();
            }

            else if((e.key == "ArrowLeft" || e.key == "q")  && oldDirection != "right")
            {
                direction    = "left";
                keyLeft.src = "img/LeftArrowDown.png";
                keyQ.src = "img/KeyQDown.png";
                e.preventDefault();
            }

            else if((e.key == "ArrowDown" || e.key == "s") && oldDirection != "up")
            {
                direction = "down";
                keyDown.src = "img/DownArrowDown.png";
                keyS.src = "img/KeySDown.png";
                e.preventDefault();
            }

            else if((e.key == "ArrowUp" || e.key == "z" ) && oldDirection != "down")
            {
                direction = "up";
                keyUp.src = "img/UpArrowDown.png";
                keyZ.src = "img/KeyZDown.png";
                e.preventDefault();
            }

            oldDirection = direction;
            fired = true;
        }
    };

    onkeyup = (e) =>{
        if(e.key == "ArrowRight"|| e.key == "d") 
            {keyRight.src = "img/RightArrow.png"; keyD.src = "img/KeyD.png";}
        if(e.key == "ArrowLeft" || e.key == "q") 
            {keyLeft.src  = "img/LeftArrow.png";  keyQ.src = "img/KeyQ.png";}
        if(e.key == "ArrowDown" || e.key == "s")
            {keyDown.src   = "img/DownArrow.png"; keyS.src = "img/KeyS.png";}
        if(e.key == "ArrowUp"   || e.key == "z") 
            {keyUp.src    = "img/UpArrow.png";    keyZ.src = "img/KeyZ.png";}
    };
}

/***************Snake Direction****************************************/
function newDirection(snake)
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

    fired = false; //end of move

    for(let element of snake) element.drawRect(); //draw snake
}

/***************Snake eats apple****************************************/
function eat(snake,pomme)
{
    if(snake[0].posX == pomme.posX && snake[0].posY == pomme.posY)
    {
        score++;
        if(score % 3) speed--;
        if(score == highScore && score > 5) pomme.color = "#FF9FE7";
        else pomme.color = "greenYellow";
        music.playbackRate += 0.01;
        newHiScore(score);
        glup.play();
        snake.push(new Shape(null,null,"#FFCEB8"));

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
        for(let element of snake) {element.color= "red"; element.drawRect()};

        drawMessage("GAME OVER");
        stopAnimation = true;
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
    ctx.shadowColor   = "black";
    
    ctx.fillStyle = "orangered";
    ctx.font = "70px Permanent Marker";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(text,width/2,height/2);
    ctx.strokeStyle = "white";
    ctx.strokeText(text,width/2,height/2);
}

/*****************************Sound Control****************************/
function mute(sound)
{
    if(sound == "off")
    {
        speaker.textContent = "🔈";
        for (let audio of tabAudio) audio.muted = true;
    }
}

speaker.onclick = () =>{
    if(speaker.textContent == "🔊")
    {
        speaker.textContent = "🔈";
        for (let audio of tabAudio) audio.muted = true;
        localStorage.setItem("sound","off");
    }

    else
    {
        speaker.textContent = "🔊";
        for (let audio of tabAudio) audio.muted = false;
        localStorage.setItem("sound","on");
    }
}
 
/***************Score Display and HighScore*********************************************/
function scoreDisplay(score)
{
    ctx.shadowBlur    = 2;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowColor   = "#363636";
    
    ctx.fillStyle = "#4B937B";
    ctx.font = "bold 18px Orbitron";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(`Score: ${score}`,width-160,4);
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