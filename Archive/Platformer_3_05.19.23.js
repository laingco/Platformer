/**
* Title: Platformer
* Author: Cooper Laing
* Date: 19/05/23
* Version: 3
* Purpose: Assessment
**/

console.log("Platformer game")

const WIDTH = 1000
const HEIGHT = 600

const LAVA_COLOR = 'red'            //Required constants
const WALL_COLOR = 'dimgray'
const WALL_WIDTH = 50
const BACKGROUND_COLOR = 'lightgrey'
const NUMBER_OF_SNOW = 1000
const PLAYER_IMAGE_WIDTH = 140
const PLAYER_IMAGE_HEIGHT = 96


var ctx

var level = 0                       //Required variables
var deaths = 0
var mouseX = 0
var mouseY = 0
var isNewLevel = true
var scale1 = [] 
var scale2 = []
var scale3 = []
var triangleX = []
var triangleY = []
var upPressed = false
var downPressed = false
var leftPressed = false
var rightPressed = false
var playerXPosition = 0
var playerYPosition = HEIGHT - WALL_WIDTH
var playerSprite = 'Santa/Idle (1).png'

var playerSpriteRight = new Image()
playerSpriteRight.src = playerSprite

window.onload=startCanvas               //Start canvas

function startCanvas(){
    ctx=document.getElementById("myCanvas").getContext("2d")
    timer = setInterval(updateCanvas, 20);
    
    var count = 0                                               //Create arrays for background image creation
    while(count < NUMBER_OF_SNOW){
        scale1.push(Math.random()*0.5)
        scale2.push(Math.random()*0.5)
        scale3.push(Math.random()*0.5)
        triangleX.push(Math.random()* WIDTH)
        triangleY.push(Math.random()* HEIGHT - (WALL_WIDTH + 2))
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
    ctx.fillText("Player X position: " + playerXPosition,30,30)
	ctx.fillText("Player Y position: " + playerYPosition,30,50)

    ctx.drawImage(playerSpriteRight, playerXPosition-30, playerYPosition-PLAYER_IMAGE_HEIGHT+10, PLAYER_IMAGE_WIDTH, PLAYER_IMAGE_HEIGHT)

    if(rightPressed){
        playerXPosition =+ playerXPosition + 5
    }
    if(leftPressed){
        playerXPosition =+ playerXPosition - 5
    }
    if(upPressed){
        playerYPosition =+ playerYPosition - 5
    }
    if(downPressed){
        playerYPosition =+ playerYPosition + 5
    }
}

window.addEventListener('keydown', keyDown)

function keyDown(keyboardEvent){
    var keyDown = keyboardEvent.key

    if(keyDown == 'w'){
        upPressed = true
    }
    if(keyDown == 'a'){
        leftPressed = true
    }
    if(keyDown == 's'){
        downPressed = true
    }
    if(keyDown == 'd'){
        rightPressed = true
    }
}

window.addEventListener('keyup', keyUp)

function keyUp(keyboardEvent){
    var keyUp = keyboardEvent.key

    if(keyUp == 'w'){
        upPressed = false
    }
    if(keyUp == 'a'){
        leftPressed = false
    }
    if(keyUp == 's'){
        downPressed = false
    }
    if(keyUp == 'd'){
        rightPressed = false
    }
}


function isTouching(x1, y1, x2, y2, x3, y3){        //Checking for collision
    if(x1 > x2 && x1 < x3 && y1 > y2 && y1 < y3){
        return(true)
    }else{
        return(false)
    }
}