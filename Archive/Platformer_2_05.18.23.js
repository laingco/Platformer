/**
* Title: Platformer
* Author: Cooper Laing
* Date: 18/05/23
* Version: 2
* Purpose: Assessment
**/

console.log("Platformer game")

const WIDTH = 1000
const HEIGHT = 600

const LAVA_COLOR = 'red'
const WALL_COLOR = 'dimgray'
const WALL_WIDTH = 50
const BACKGROUND_COLOR = 'lightgrey'
const NUMBER_OF_SNOW = 1000

var ctx

var level = 0
var deaths = 0
var mouseX = 0
var mouseY = 0
var isNewLevel = true
var scale1 = [] 
var scale2 = []
var scale3 = []
var triangleX = []
var triangleY = []

window.onload=startCanvas

function startCanvas(){
    ctx=document.getElementById("myCanvas").getContext("2d")
    timer = setInterval(updateCanvas, 20);
    
    count = 0
    while(count < NUMBER_OF_SNOW){
        scale1.push = Math.random()*0.5
        scale2.push = Math.random()*0.5
        scale3.push = Math.random()*0.5
        triangleX.push = Math.random()* WIDTH
        triangleY.push = Math.random()* HEIGHT - (WALL_WIDTH + 2)
        count++
    }
    

}

function updateCanvas(){
    ctx.fillStyle = BACKGROUND_COLOR
    ctx.fillRect(0, 0, WIDTH, HEIGHT-WALL_WIDTH)


    var count = 0
    while(count < NUMBER_OF_SNOW){
        ctx.fillStyle = 'white'
        ctx.beginPath();
        ctx.moveTo(triangleX[count],triangleY[count]);
        ctx.lineTo(triangleX[count]+20*scale1[count],triangleY[count]);
        ctx.lineTo(triangleX[count]+10*scale2[count],triangleY[count]+20*scale3[count]);
        ctx.fill();
    
       count++
    }


    ctx.fillStyle = WALL_COLOR
    ctx.fillRect(0, HEIGHT-WALL_WIDTH, WIDTH, WALL_WIDTH)

    //console.log('Mouse pos is ', mouseX, ', ', mouseY)
    ctx.fillStyle = 'black'
    ctx.fillText('Mouse pos: ' + mouseX + ', '+ mouseY, 20, 20)

    
}

window.addEventListener('mousemove', mouseMoved)

function mouseMoved(mouseEvent){
    mouseX = mouseEvent.offsetX
    mouseY = mouseEvent.offsetY
}


function isTouching(x1, y1, x2, y2, x3, y3){        //Checking for collision
    if(x1 > x2 && x1 < x3 && y1 > y2 && y1 < y3){
        return(true)
    }else{
        return(false)
    }
}