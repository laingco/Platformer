/**
* Title: Platformer
* Author: Cooper Laing
* Date: 19/05/23
* Version: -
* Purpose: Assessment
**/
//Credit for image flipping code: https://stackoverflow.com/questions/35973441/how-to-horizontally-flip-an-image
//Credit for sprite: https://www.gameart2d.com/santa-claus-free-sprites.html

console.log("Platformer game")

//Required constants
const WIDTH = 1000
const HEIGHT = 600
const LAVA_COLOR = 'red'           
const WALL_COLOR = 'dimgray'
const WALL_WIDTH = 50
const BACKGROUND_COLOR = 'lightgrey'
const NUMBER_OF_SNOW = 1000
const PLAYER_IMAGE_WIDTH = 140
const PLAYER_IMAGE_HEIGHT = 96
const PUSHBACK = 2
const SPEED = 2
const JUMP_HEIGHT = 50
const JUMP_SPEED = 2*SPEED

//Required variables
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
var upPressed = false
var downPressed = false
var leftPressed = false
var rightPressed = false
var playerXPosition = 0
var playerYPosition = HEIGHT - WALL_WIDTH - 1
var playerXSpeed = 0
var playerYSpeed = 0
var playerSprite = 'Santa/Idle (1).png'
var lastDirection = 1//Direction the player is facing
var obstacleArray = []//Stores all obstacles/platforms
var stop = false
var jumping = false
var falling = false
var movingUp = false
var movingDown = false
var movingLeft = false
var movingRight = false
var multiplier = 1
var peak = 80
var playerWidth = PLAYER_IMAGE_WIDTH/2.65
var playerHeight = PLAYER_IMAGE_HEIGHT+15
var time = 0
var jumpEnds = 0
var canJump = true
var fastFall = false

var playerSpriteRight = new Image()
playerSpriteRight.src = playerSprite

window.onload=startCanvas               //Start canvas

function startCanvas(){
    ctx=document.getElementById("myCanvas").getContext("2d")
    timer = setInterval(updateCanvas, 5);
    
    //Creation od arrays for background image
    var count = 0                                               
    while(count < NUMBER_OF_SNOW){
        scale1.push(Math.random()*0.5)
        scale2.push(Math.random()*0.5)
        scale3.push(Math.random()*0.5)
        triangleX.push(Math.random()* WIDTH)
        triangleY.push(Math.random()* HEIGHT - (WALL_WIDTH + 2))
        count++
    }
    //obstacleArray.push(new Barrier(0, HEIGHT-WALL_WIDTH, WIDTH, WALL_WIDTH))

    //Level 1 Obstacles/barriers
    obstacleArray.push(new Barrier(350, 400, 300, 150, 0, false))
    obstacleArray.push(new Barrier(500, 250, 300, 150, 0, false))
    obstacleArray.push(new Barrier(WIDTH-50, 375, 50, 30, 0, false))
    obstacleArray.push(new Barrier(WIDTH-10, 0, 10, 375, 0, true))

    //Level 2 Obstacles/barriers
    obstacleArray.push(new Barrier(400, HEIGHT-WALL_WIDTH-30, 75, 30, 1, false))            
    obstacleArray.push(new Barrier(475, HEIGHT-WALL_WIDTH-30, 75, 30, 1, true))
    obstacleArray.push(new Barrier(550, HEIGHT-WALL_WIDTH-30, 75, 30, 1, false))
}

function updateCanvas(){
    //Win conditions/End screen
    if(level == 10){
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, WIDTH, HEIGHT)
        ctx.font = "100px Arial";
        ctx.fillStyle = 'black'
        ctx.fillText("You Win!", 320, 325);
        return
    }

    //Drawing randmized background
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

    //Drawing floor
    ctx.fillStyle = WALL_COLOR
    ctx.fillRect(0, HEIGHT-WALL_WIDTH, WIDTH, WALL_WIDTH)

    //Info text
    ctx.fillStyle = 'black'
    ctx.font = '20px Arial'
    ctx.fillText("Level: " + (level+1),30,30)
	ctx.fillText('Deaths: ' + deaths,30,50)
    /*ctx.fillText("Player X speed: " + playerXSpeed,30,70)
	ctx.fillText("Player Y speed: " + playerYSpeed,30,90)
    ctx.fillText("Player Falling: " + falling,30,110)
    ctx.fillText("Player Moving Up: " + movingUp,30,130)
    ctx.fillText("Player Jump ends: " + jumpEnds,30,150)
    ctx.fillText("Game time " + time, 30, 170)
    ctx.fillText("CanJump? " + canJump, 30, 190)
    ctx.fillText("Player X position: " + playerXPosition, 30, 210)
    ctx.fillText("Player Y position: " + playerYPosition, 30, 230)*/


    //Facing/drawing the player in the correct orientation
    if(lastDirection > 0){
        ctx.drawImage(playerSpriteRight, playerXPosition-30, playerYPosition-PLAYER_IMAGE_HEIGHT+10, PLAYER_IMAGE_WIDTH, PLAYER_IMAGE_HEIGHT)
    }else if(lastDirection < 0){
        flipHorizontally(playerSpriteRight,playerXPosition-60, playerYPosition-PLAYER_IMAGE_HEIGHT+10, PLAYER_IMAGE_WIDTH, PLAYER_IMAGE_HEIGHT)
    } 

    //Makes the player move in response to the speed variables
    playerXPosition = playerXPosition + playerXSpeed
    playerYPosition = playerYPosition - playerYSpeed

    //Drawing of all obstacles/platforms & gravity falling off of the edge of platforms
    count = 0
    while(count < obstacleArray.length){
        if(obstacleArray[count].lvl == level){
            if(obstacleArray[count].obst == true){
                ctx.fillStyle = 'red'
                ctx.fillRect(obstacleArray[count].xPosition, obstacleArray[count].yPosition, obstacleArray[count].width, obstacleArray[count].height)

            }else if(obstacleArray[count].obst == false){
                ctx.fillStyle = WALL_COLOR
                ctx.fillRect(obstacleArray[count].xPosition, obstacleArray[count].yPosition, obstacleArray[count].width, obstacleArray[count].height)
            }
            if(!movingUp&&(playerXPosition+playerWidth<obstacleArray[count].xPosition && playerXPosition+playerWidth>obstacleArray[count].xPosition-3||
                playerXPosition>obstacleArray[count].xPosition+obstacleArray[count].width && playerXPosition<obstacleArray[count].xPosition+obstacleArray[count].width+3)&&
            playerYPosition<obstacleArray[count].yPosition&&playerYPosition>obstacleArray[count].yPosition-10){
                falling = true
            }
        }
        //ctx.strokeRect(obstacleArray[count].xPosition,obstacleArray[count].yPosition,10,10)
        count++
    }

    //Collison mekanism for all of the platforms
    count = 0
    while(count < obstacleArray.length){
        if(obstacleArray[count].lvl == level && obstacleArray[count].obst == false){
            if(isTouching(playerXPosition,playerYPosition-PLAYER_IMAGE_HEIGHT+15,PLAYER_IMAGE_WIDTH/2.65,PLAYER_IMAGE_HEIGHT-15, 
            obstacleArray[count].xPosition, obstacleArray[count].yPosition, obstacleArray[count].width, obstacleArray[count].height)){
                console.log('Touching!', count, movingUp, movingDown, movingLeft, movingRight, jumping, falling)
                //stop = true
                if(falling&&playerYPosition<=obstacleArray[count].yPosition+2*PUSHBACK){
                    playerYPosition = obstacleArray[count].yPosition-PUSHBACK
                    falling = false
                }
                if(movingRight){
                    playerXPosition = playerXPosition - PUSHBACK
                }
                if(movingLeft){
                    playerXPosition = playerXPosition + PUSHBACK
                }
                if(movingUp&&playerYPosition>=obstacleArray[count].yPosition+obstacleArray[count].height-2*PUSHBACK){
                    playerYPosition = playerYPosition + JUMP_SPEED
                    falling = true
                }
            }
        }
        count++
    } 

    //Main gravity mekanism 
    if(falling){
        playerYPosition = playerYPosition + JUMP_SPEED
        if(fastFall){
            playerYPosition = playerYPosition + 2*SPEED  
        }
    } 

    //Basic collision for stationary floor
    if(playerYPosition > 550){
        playerYPosition = 548
         falling = false
    }

    //Allows the player to go back levels and also prevents falling off of level 1
    if(playerXPosition < 0){
        if(level == 0){
            playerXPosition = 0
        }else {
            playerXPosition = WIDTH
            level--
        }
    }

    //Prevents player from flying through the roof
    if(playerYPosition < 0){
        playerYPosition = 0
    }

    //Movies the player back to the spawn point and moves onto the next level
    if(playerXPosition > WIDTH){
        playerXPosition = 0
        level++
    }

    //Outlines for debugging
    ctx.strokeStyle = "rgb(0,255,0)" 
	//ctx.strokeRect(playerXPosition,playerYPosition-PLAYER_IMAGE_HEIGHT+15,PLAYER_IMAGE_WIDTH/2.65,PLAYER_IMAGE_HEIGHT-15);
    //ctx.strokeRect(playerXPosition, playerYPosition, 10, -10)

    //Main game clock for jumping
    time ++

    //Stops the player from jumping too high
    if(time == jumpEnds){
        movingUp = false
        falling = true
        jumping = false
    }

    //Allows the jump buttion to be continuously held down and have the correct jump height
    if(playerYSpeed > 0 && !falling){
        movingUp = true
    }else if(playerYSpeed > 0 && falling){
        movingUp = false
        jumpEnds = time + JUMP_HEIGHT
    }

    //Checking for all obstacles/hazards and descends the level and moves player back to the spawn point
    count = 0
    while(count < obstacleArray.length){
        if(obstacleArray[count].lvl == level && obstacleArray[count].obst == true){
            if(isTouching(playerXPosition,playerYPosition-PLAYER_IMAGE_HEIGHT+15,PLAYER_IMAGE_WIDTH/2.65,PLAYER_IMAGE_HEIGHT-15, 
            obstacleArray[count].xPosition, obstacleArray[count].yPosition, obstacleArray[count].width, obstacleArray[count].height)){
            playerXPosition = 0
            playerYPosition = HEIGHT - WALL_WIDTH - 1
            level--
            deaths++
            }
        }
        count++
    }

    //Prevents the level variable from going negative
    if(level < 0){
        level++
    }
}

window.addEventListener('keydown', keyDown)

//Listening for all movement keys
function keyDown(keyboardEvent){                
    var keyDown = keyboardEvent.key

    //Jumps when the 'W' key is pressed
    if(keyDown == 'w'){
        console.log(keyDown)
        if(canJump){
            jump()
        }
    }

    //Moves the player left when 'A' key is pressed
    if(keyDown == 'a'){
        console.log(keyDown)
        playerXSpeed = -SPEED
        lastDirection = -1
        movingLeft = true
        return
    }

    //Moves the player right when the 'D' key is pressed
    if(keyDown == 'd'){
        console.log(keyDown)
        playerXSpeed = +SPEED
        lastDirection = 1
        movingRight = true
        return
    }
}

window.addEventListener('keyup', keyUp)

//Listens for any movement key being released
function keyUp(keyboardEvent){          
    var keyUp = keyboardEvent.key

    //Stops the player jumping when the key is released
    if(keyUp == 'w'){
        playerYSpeed = 0
        movingUp = false
        falling = true
        jumping = false
        multiplier = 5 
        canJump = true
        fastFall = false
    }

    //Stops the player moving left when the key is released
    if(keyUp == 'a'){
        playerXSpeed = 0
        movingLeft = false
    }

    //Stops the player moving right when the key is released
    if(keyUp == 'd'){
        playerXSpeed = 0
        movingRight = false
    }
}

//Template function for any rectangular collsion 
function isTouching(x1, y1, width1, height1, x2, y2, width2, height2){       
    if((x1 + width1 >= x2 && x1 <= x2 + width2) && (y1 + height1 >= y2 && y1 <= y2 + height2)){  
        return(true)
    }else{
        return(false)
    }
}

//Flips and draws any image 
function flipHorizontally(image, x, y, width, height){         
    ctx.translate(x + width, y);
    ctx.scale(-1, 1);
    ctx.drawImage(image, 0, 0, width, height);
    ctx.setTransform(1,0,0,1,0,0);
}

//Makes the player jump when called
function jump(){
    canJump = false
    jumping = true
    if(!falling && !movingUp){
        jumpEnds = time + JUMP_HEIGHT
        movingUp = true
        playerYSpeed = +2*SPEED
        fastFall = true
    }
}

//Class for creating all obstacles and platforms
class Barrier{    
    constructor(x, y, w, h, lvl, obst){
        this.xPosition = x
        this.yPosition = y
        this.width = w
        this.height = h
        this.lvl = lvl
        this.obst = obst
    }
}