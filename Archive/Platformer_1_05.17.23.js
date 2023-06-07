/**
* Title: Platformer
* Author: Cooper Laing
* Date: 17/05/23
* Version: 1
* Purpose: Assessment
**/

const WIDTH = 1000
const HEIGHT = 600

const LAVA_COLOR = 'red'
const WALL_COLOR = 'dimgray'
const WALL_WIDTH = 50
const BACKGROUND_COLOR = 'lightgrey'

var ctx

var lvl = 0
var deaths = 0

window.onload=startCanvas

function startCanvas(){
    ctx=document.getElementById("myCanvas").getContext("2d")
    timer = setInterval(updateCanvas, 20);
    ctx.fillStyle = BACKGROUND_COLOR
    ctx.fillRect(0, 0, WIDTH, HEIGHT-WALL_WIDTH)

    var count = 0
    while(count<1500){
    ctx.fillStyle = 'white'
    var scale1 = Math.random()*0.5
    var scale2 = Math.random()*0.5
    var scale3 = Math.random()*0.5
    var triangleX = Math.random()* WIDTH
    var triangleY = Math.random()* HEIGHT - (WALL_WIDTH + 2)

    ctx.beginPath();
    ctx.moveTo(triangleX,triangleY);
    ctx.lineTo(triangleX+20*scale1,triangleY);
    ctx.lineTo(triangleX+10*scale2,triangleY+20*scale3);
    ctx.fill();

    count++
    }
    ctx.fillStyle = WALL_COLOR
    ctx.fillRect(0, HEIGHT-WALL_WIDTH, WIDTH, WALL_WIDTH)
}

function updateCanvas(){

    
    
   
    

    //var backgroundImage = new Image();  
    //backgroundImage.src = 'cool.png';
    //ctx.drawImage(backgroundImage, 0, 0)



}
