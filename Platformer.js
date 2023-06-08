/**
* Title: Platformer
* Author: Cooper Laing
* Date: 19/05/23
* Version: 3
* Purpose: Assessment
**/
//Credit for image flipping code: https://stackoverflow.com/questions/35973441/how-to-horizontally-flip-an-image
//Credit for sprite: https://www.gameart2d.com/santa-claus-free-sprites.html

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
const PUSHBACK = 2
const SPEED = 2
const JUMP_HEIGHT = 10
const JUMP_SPEED = 2*SPEED


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
var playerYPosition = HEIGHT - WALL_WIDTH - 1
var playerXSpeed = 0
var playerYSpeed = 0
var playerSprite = 'Santa/Idle (1).png'
var lastDirection = 1           //Direction the player is facing
var obstacleArray = []
var stop = false
var jumping = false
var falling = false
var movingUp = false
var movingDown = false
var movingLeft = false
var movingRight = false
var multiplier = 1
var peak = 175
var playerWidth = PLAYER_IMAGE_WIDTH/2.65
var playerHeight = PLAYER_IMAGE_HEIGHT+15
var time = 0
var jumpEnds = 0
var canJump = true

var playerSpriteRight = new Image()
playerSpriteRight.src = playerSprite

window.onload=startCanvas               //Start canvas

function startCanvas(){
    ctx=document.getElementById("myCanvas").getContext("2d")
    timer = setInterval(updateCanvas, 5);
    
    var count = 0                                               //Create arrays for background image creation
    while(count < NUMBER_OF_SNOW){
        scale1.push(Math.random()*0.5)
        scale2.push(Math.random()*0.5)
        scale3.push(Math.random()*0.5)
        triangleX.push(Math.random()* WIDTH)
        triangleY.push(Math.random()* HEIGHT - (WALL_WIDTH + 2))
        count++
    }
    obstacleArray.push(new Barrier(0, HEIGHT-WALL_WIDTH, WIDTH, WALL_WIDTH))
    obstacleArray.push(new Barrier(350, 400, 300, 150))
    obstacleArray.push(new Barrier(350, 100, 300, 150))
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


    //ctx.fillStyle = WALL_COLOR
    //ctx.fillRect(0, HEIGHT-WALL_WIDTH, WIDTH, WALL_WIDTH)

    //console.log('Mouse pos is ', mouseX, ', ', mouseY)
    ctx.fillStyle = 'black'
    ctx.fillText("Player X position: " + playerXPosition,30,30)
	ctx.fillText("Player Y position: " + playerYPosition,30,50)
    ctx.fillText("Player X speed: " + playerXSpeed,30,70)
	ctx.fillText("Player Y speed: " + playerYSpeed,30,90)
    ctx.fillText("Player Falling: " + falling,30,110)
    ctx.fillText("Player Moving Up: " + movingUp,30,130)
    ctx.fillText("Player Jump ends: " + jumpEnds,30,150)


    if(lastDirection > 0){
    //ctx.drawImage(playerSpriteRight, playerXPosition-30, playerYPosition-PLAYER_IMAGE_HEIGHT+10, PLAYER_IMAGE_WIDTH, PLAYER_IMAGE_HEIGHT)
    ctx.drawImage(playerSpriteRight, playerXPosition-30, playerYPosition-PLAYER_IMAGE_HEIGHT+10, PLAYER_IMAGE_WIDTH, PLAYER_IMAGE_HEIGHT)
    }else if(lastDirection < 0){
        flipHorizontally(playerSpriteRight,playerXPosition-60, playerYPosition-PLAYER_IMAGE_HEIGHT+10, PLAYER_IMAGE_WIDTH, PLAYER_IMAGE_HEIGHT)
    } 

    playerXPosition = playerXPosition + playerXSpeed
    playerYPosition = playerYPosition - playerYSpeed

    ctx.fillStyle = WALL_COLOR
    count = 0
    while(count < obstacleArray.length){
        ctx.fillRect(obstacleArray[count].xPosition, obstacleArray[count].yPosition, obstacleArray[count].width, obstacleArray[count].height)
        if(!jumping&&(playerXPosition+playerWidth<obstacleArray[count].xPosition||playerXPosition>obstacleArray[count].xPosition+obstacleArray[count].width)&&
        playerYPosition<obstacleArray[count].yPosition&&playerYPosition>obstacleArray[count].yPosition-10){
            falling = true
        }
        ctx.strokeRect(obstacleArray[count].xPosition,obstacleArray[count].yPosition,10,10)
        count++
    }

    count = 0
    while(count < obstacleArray.length){
        if(isTouching(playerXPosition,playerYPosition-PLAYER_IMAGE_HEIGHT+15,PLAYER_IMAGE_WIDTH/2.65,PLAYER_IMAGE_HEIGHT-15, 
        obstacleArray[count].xPosition, obstacleArray[count].yPosition, obstacleArray[count].width, obstacleArray[count].height)){
            console.log('Touching!', count, movingUp, movingDown, movingLeft, movingRight, jumping, falling)
            //stop = true
            if(falling&&playerYPosition<=obstacleArray[count].yPosition+2*PUSHBACK){
                playerYPosition = obstacleArray[count].yPosition-1
                falling = false
            }
            if(movingRight){
                playerXPosition = playerXPosition - PUSHBACK
            }
            if(movingLeft){
                playerXPosition = playerXPosition + PUSHBACK
            }
            if(movingUp&&playerYPosition>obstacleArray[count].yPosition+obstacleArray[count].height){
                playerYPosition = playerYPosition + JUMP_SPEED
            }
        }
        count++
    } 

    /* count = 1 
    while(count < obstacleArray.length){
        if(isTouching(playerXPosition,playerYPosition-PLAYER_IMAGE_HEIGHT+15,PLAYER_IMAGE_WIDTH/2.65,PLAYER_IMAGE_HEIGHT-15, 
        obstacleArray[count].xPosition, obstacleArray[count].yPosition, obstacleArray[count].width, obstacleArray[count].height)
        == "leftHit"){
            playerXPosition = playerXPosition - PUSHBACK
        }else if(isTouching(playerXPosition,playerYPosition-PLAYER_IMAGE_HEIGHT+15,PLAYER_IMAGE_WIDTH/2.65,PLAYER_IMAGE_HEIGHT-15, 
        obstacleArray[count].xPosition, obstacleArray[count].yPosition, obstacleArray[count].width, obstacleArray[count].height)
        == "rightHit"){
            playerXPosition = playerXPosition + PUSHBACK
        }else if(isTouching(playerXPosition,playerYPosition-PLAYER_IMAGE_HEIGHT+15,PLAYER_IMAGE_WIDTH/2.65,PLAYER_IMAGE_HEIGHT-15, 
            obstacleArray[count].xPosition, obstacleArray[count].yPosition, obstacleArray[count].width, obstacleArray[count].height)
        == "topHit"){
            playerYPosition = playerYPosition - PUSHBACK
            falling = false
        }else if(isTouching(playerXPosition,playerYPosition-PLAYER_IMAGE_HEIGHT+15,PLAYER_IMAGE_WIDTH/2.65,PLAYER_IMAGE_HEIGHT-15, 
        obstacleArray[count].xPosition, obstacleArray[count].yPosition, obstacleArray[count].width, obstacleArray[count].height)
        == "bottomHit"){
            playerYPosition = playerYPosition + PUSHBACK
        }
        console.log(isTouching(playerXPosition,playerYPosition-PLAYER_IMAGE_HEIGHT+15,PLAYER_IMAGE_WIDTH/2.65,PLAYER_IMAGE_HEIGHT-15, 
        obstacleArray[count].xPosition, obstacleArray[count].yPosition, obstacleArray[count].width, obstacleArray[count].height))
        count++
    } */

   /*  if(stop){
        if(playerXSpeed > 0){
            playerXPosition = playerXPosition - PUSHBACK
        }
    }
    if(stop){
        if(playerXSpeed < 0){
            playerXPosition = playerXPosition + PUSHBACK
        }
    }
    if(stop){
        if(playerYSpeed < 0){
            playerYPosition = playerYPosition - PUSHBACK
        }
    }
    if(stop){
        if(playerYSpeed > 0){
            playerYPosition = playerYPosition + PUSHBACK
        }
    } */

    //if(jumping){
    //    falling = true
    //    movingDown = true
    //}

    if(falling){
        playerYPosition = playerYPosition + JUMP_SPEED + 1
    } 

    //if(playerYPosition > 550){
    //    playerYPosition = 548
   //     falling = false
    //}
    ctx.strokeStyle = "rgb(0,255,0)" 
	ctx.strokeRect(playerXPosition,playerYPosition-PLAYER_IMAGE_HEIGHT+15,PLAYER_IMAGE_WIDTH/2.65,PLAYER_IMAGE_HEIGHT-15);
    ctx.strokeRect(playerXPosition, playerYPosition, 10, -10)
    time ++
    if(time == jumpEnds){
        movingUp = false
        falling = true
    }
}

window.addEventListener('keydown', keyDown)

function keyDown(keyboardEvent){                //Moves the player
    var keyDown = keyboardEvent.key
    //if(keyDown == 'w' && time < jumpEnds){
    //   return
    //}

    if(keyDown == 'w' && !falling && !movingUp && canJump){
        //jump()
        movingUp = true
        playerYSpeed = +2*SPEED
        jumping = true
        jumpEnds = time + 50
        console.log(keyDown)
    }
    
    
    if(keyDown == 'a'){
        playerXSpeed = -SPEED
        lastDirection = -1
        movingLeft = true
    }

    /* if(keyDown == 's'){
        playerYSpeed = -SPEED
        movingDown = true
    } */

    if(keyDown == 'd'){
        playerXSpeed = +SPEED
        lastDirection = 1
        movingRight = true
    }
}

window.addEventListener('keyup', keyUp)

function keyUp(keyboardEvent){          //Stops movement when key is released
    var keyUp = keyboardEvent.key

    if(keyUp == 'w'){
        playerYSpeed = 0
        movingUp = false
        falling = true
        jumping = false
        multiplier = 5 
        canJump = true
        
    }

    if(keyUp == 'a'){
        playerXSpeed = 0
        movingLeft = false
    }

    /* if(keyUp == 's'){
        playerYSpeed = -1
        movingDown = false
        falling = true
    } */

    if(keyUp == 'd'){
        playerXSpeed = 0
        movingRight = false
    }
}


function isTouching(x1, y1, width1, height1, x2, y2, width2, height2){        //Checking for collision
    if((x1 + width1 >= x2 && x1 <= x2 + width2) && (y1 + height1 >= y2 && y1 <= y2 + height2)){
        /*if(lastDirection == 1 && y1 + height1 >= y2 + height2){
            return('leftHit')
        }else if(lastDirection == -1 && y1 + height1 >= y2 + height2){
            return('rightHit')
        }else if(falling && y1 + height1 >= y2){
            return('topHit')
        }else if(jumping && y1 <= y2 + height2){
            return('bottomHit')
        }else{
            return(false)
        }
    } */    
        return(true)
    }else{
        return(false)
    }
}

function flipHorizontally(image, x, y, width, height){          //Image flipping code
    ctx.translate(x + width, y);
    ctx.scale(-1, 1);
    ctx.drawImage(image, 0, 0, width, height);
    ctx.setTransform(1,0,0,1,0,0);
}

/*function jump(){
    playerYPosition = playerYPosition - multiplier
    canJump = false
    //multiplier = 1
    //playerYPosition = playerYPosition + 100
    //playerYPosition = playerYPosition - 100
} */

class Barrier{          //Class for obstacles
    constructor(x, y, w, h){
        this.xPosition = x
        this.yPosition = y
        this.width = w
        this.height = h
    }
}