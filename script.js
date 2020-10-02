"use strict";

//Canvas
const ctx = canvas.getContext("2d");
const width   = 600;
const height  = 600;
canvas.width  = width;
canvas.height = height;
const blockSize = 15;


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
        ctx.arc(this.posX*blockSize,this.posY*blockSize,this.radius*blockSize,0, Math.PI*2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = "green";
        ctx.stroke();
    }

    drawRect()
    {
        ctx.beginPath();
        ctx.rect(this.posX*blockSize,this.posY*blockSize,this.l*blockSize,this.h*blockSize);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

const pomme = new Shape(1,1,0,0,1,"greenYellow");//x,y,**,**,radius,color

const snake = [
    new Shape(10,10,1,1,0,"gold"),
    new Shape(11,10,1,1,0,"black"),
    new Shape(12,10,1,1,0,"black"),
    new Shape(13,10,1,1,0,"black"),
    new Shape(14,10,1,1,0,"black"),
];

let stopAnimation = false;


function snakeControl()
{
    //sur tout le document
    const arrow = {
        "ArrowRight": "right",
        "ArrowLeft" : "left",
        "ArrowUp"   : "up" ,
        "ArrowDown" : "down",
    }
    onkeydown = (e) => {
        if(e.key in arrow) direction = arrow[e.key];
        if(e.key == " ") gamePause();
    }
}


let animation = requestAnimationFrame(motion);
let direction = "left";


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
        animation = requestAnimationFrame(motion)},80);
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
        snake[0].posX-=1;
    }

    else if(direction == "right")
    {
        updatePosition(snake);
        snake[0].posX+=1;
    }

    else if(direction == "up")
    {
        updatePosition(snake);
        snake[0].posY-=1;
    }

    else if(direction == "down")
    {
        updatePosition(snake);
        snake[0].posY+=1;
    }

    for(let element of snake) 
    {
        if(element == snake[0]) element.color = "gold";
        else element.color = "black";
        element.drawRect();
    }
}


function gamePause()
{ 
    if(stopAnimation == false)
    {
        stopAnimation = true;
        console. log('stopAnimation:', stopAnimation)

        cancelAnimationFrame(animation); //Freeze Animation
    }
 
    else 
    {
        stopAnimation = false;
        console.log('stopAnimation:', stopAnimation)
        requestAnimationFrame(motion);
    }          
}   