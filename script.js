"use strict";

//Canvas
const ctx = canvas.getContext("2d");
const width   = 600;
const height  = 600;
canvas.width  = width;
canvas.height = height;
const blockSize = 20;


//--------------------Quadrillage----------------------------


function quadrillage() {
for (let i = 1; i < width/blockSize; i++) 
    {
        ctx.strokeStyle = "gray"; //couleur du quadrillage
        ctx.shadowBlur    = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.beginPath();
        ctx.moveTo(0, blockSize * i);
        ctx.lineTo(width, blockSize * i);
        ctx.stroke();

        ctx.moveTo(blockSize * i, 0);
        ctx.lineTo(blockSize * i, height);
        ctx.stroke();
        ctx.closePath();
    }
}


class Shape
{
    constructor (posX,posY,l,h,radius,color)
    {
        this.posX   = posX;		
        this.posY   = posY;
        this.l      = l;
        this.h      = h;
        this.radius = radius;
        this.color  = color;
        this.stroke = "#282828";
    }

    drawCircle()
    {
        ctx.shadowBlur    = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowColor   = "#363636";
        
        ctx.beginPath();
        ctx.arc(this.posX,this.posY,this.radius,0, Math.PI*2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = "green";
        ctx.stroke();
    }

    drawRect()
    {
        ctx.beginPath();
        ctx.rect(this.posX,this.posY,this.l,this.h);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

const pomme = new Shape(1,1,0,0,1,"greenYellow");//x,y,**,**,radius,color

const snake = [
    new Shape(50,50,blockSize,blockSize,0,"gold"),
    new Shape(60,50,blockSize,blockSize,0,"black"),
    new Shape(70,50,blockSize,blockSize,0,"black"),
    new Shape(80,50,blockSize,blockSize,0,"black"),
    new Shape(90,50,blockSize,blockSize,0,"black"),
];

let stopAnimation = false;
let animation = requestAnimationFrame(motion);
let direction = "left";
let oldDirection;


function motion()
{
    ctx.clearRect(0, 0, width, height); //clear canvas
    //quadrillage();
    pomme.drawCircle();
    snakeControl();
    updateDirection(snake);


    output.innerHTML = `snake[0].posX=${snake[0].posX}, snake[0].posY=${snake[0].posY}
                        <br>
                        snake[1].posX=${snake[1].posX}, snake[1].posY=${snake[1].posY}
                        <br>
                        snake[2].posX=${snake[2].posX}, snake[2].posY=${snake[2].posY}
                        `;


    setTimeout(()=>{if(stopAnimation == false) 
    animation = requestAnimationFrame(motion)},100);
} 


function updatePosition(snake)
{
    for(let i=snake.length-1; i>0;i--)
    {
        snake[i].posX = snake[i-1].posX;
        snake[i].posY = snake[i-1].posY;
    }
}

function updateDirection(snake)
{
    if(direction == "left")
    {
        updatePosition(snake);
        snake[0].posX-=blockSize;
    }

    else if(direction == "right")
    {
        updatePosition(snake);
        snake[0].posX+=blockSize;
    }

    else if(direction == "up")
    {
        updatePosition(snake);
        snake[0].posY-=blockSize;
    }

    else if(direction == "down")
    {
        updatePosition(snake);
        snake[0].posY+=blockSize;
    }

    for(let element of snake) element.drawRect();

}


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

    //sur tout le document
    onkeydown = (e) => {
        if(e.key in arrow) 
        {
            oldDirection = direction;
            direction = arrow[e.key];
            document.getElementById(arrow[e.key]).src = keyImgDown[e.key];
        }
        if(e.key == "p") gamePause();
    }

    onkeyup = (e) => {
        if(e.key in arrow) 
        {
            direction = arrow[e.key];
            document.getElementById(arrow[e.key]).src = keyImgUp[e.key];
        }
    }
}


function gamePause()
{ 
    if(stopAnimation == false)
    {
        stopAnimation = true;
        console. log('stopAnimation:', stopAnimation)
        drawMessage("PAUSE");
        cancelAnimationFrame(animation); //Freeze Animation
        keyP.src = "img/KeyPDown.png";
    }
 
    else 
    {
        stopAnimation = false;
        console.log('stopAnimation:', stopAnimation)
        requestAnimationFrame(motion);
        keyP.src = "img/KeyP.png";
    }          
}   

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