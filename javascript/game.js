"use strict";

// game data in JSON format
var gameData = {
	// total lifes for player
	"numberOfInitialLifes":"5",
	// starting speed for ball
	"speedBall":"5",
	// size of ball
	"sizeBall":"15",
	// ball color
	"colorBall":"white",
	// interval at which ball speed increases (amount of paddle hits)
	"intervalBallSpeed":"5",
	// thickness of paddle
	"sizePaddleLeftX":"25",
	// length of paddle	
	"sizePaddleLeftY":"150",
	// color paddle
	"colorPaddleLeft":"white",
	// speed at which paddle moves
	"speedPaddleLeft":"15",
	// thickness of paddle	
	"sizePaddleRightX":"25",
	// length of paddle
	"sizePaddleRightY":"150",
	// color paddle
	"colorPaddleRight":"white",
	// distance paddle to canvas border
	"distancePaddle":"5"};

var numberOfInitialLifes;
var speedBall;
var sizeBall;
var colorBall;
var intervalBallSpeed;
var sizePaddleLeftX;
var sizePaddleLeftY;
var colorPaddleLeft;
var speedPaddleLeft;
var sizePaddleRightX;
var sizePaddleRightY;
var colorPaddleRight;
var distancePaddle;

// number of current lifes equals number of initial lifes at game start
var numberOfCurrentLifes;
// game running true or false
var gameRunning;
// game paused  true or false
var gamePause;
// exit wish true or false
var gameExit;
// highscore input visible true or false
var visibilityHighscore;
// player name for submitting to highscore list
var playerNew_name;
// player points for submitting to highscore list
var playerNew_points;
// key for controlling the game
var keyboardInputKey;
// update interval for refreshing the canvas
var updateInterval;
// objects in game
var paddleLeft;
var paddleRight;
var ball;
// number of bounces left - needed to increas game speed
var countBounceLeft = 0;
// player points
var playerPoints;
// ballbounce Flag to lock opposite paddle
var ballBounceLeft;
var ballBounceRight;
// canvas for game and life bar
var canvas;
var ctx;
var canvasLife;
var ctxLife;
// audio data
var soundPaddleLeft;
var soundPaddleRight;
var soundLost;
var soundGameOver;
var soundIncreaseSpeed;
var backgroundMusic;
// flag to control speed up
var speedUp = false;
// flags to  control sound and music 
var playSound = true;
var playMusic = true;
// flag to get status of keyboar press
var keyPressed = false;

// behavior at window load - call function initialize()
window.onload=initialize;

// initialize start
function initialize() {
	try {
		playerPoints = 0;
		document.getElementById("gamepage").style.cursor = "none";
		readGameData();
		getCanvasIDs();
		initializeKeyboardListener();
		// set start flags
		gameRunning = false;
		gamePause = false;
		gameExit = false;
		createComponents();
		drawComponents();
		drawLifes();
		drawStartFrame();
		getSounds();
		console.log("initialisation successful");
	} catch(err) {
		console.log ("an error occured during initialisation: " + err.message);
	}
 }
 
// function to assign JSON Data to variables
function readGameData() {
	numberOfInitialLifes = parseInt(gameData.numberOfInitialLifes,10);
	numberOfCurrentLifes = numberOfInitialLifes;
	speedBall = parseInt(gameData.speedBall,10);
	sizeBall = parseInt(gameData.sizeBall,10);
	colorBall = gameData.colorBall;
	intervalBallSpeed = parseInt(gameData.intervalBallSpeed,10);
	sizePaddleLeftX = parseInt(gameData.sizePaddleLeftX,10);
	sizePaddleLeftY = parseInt(gameData.sizePaddleLeftY,10);
	colorPaddleLeft = gameData.colorPaddleLeft;
	speedPaddleLeft = parseInt(gameData.speedPaddleLeft,10);
	sizePaddleRightX = parseInt(gameData.sizePaddleRightX,10);
	sizePaddleRightY = parseInt(gameData.sizePaddleRightY,10);
	colorPaddleRight = gameData.colorPaddleRight;
	distancePaddle = parseInt(gameData.distancePaddle,10);
}

// read in handles of canvas
 function getCanvasIDs() {
	canvas = document.getElementById("myCanvasGame");
	ctx = canvas.getContext("2d");
	canvasLife = document.getElementById("myCanvasLife");
	ctxLife = canvasLife.getContext("2d");
}

// initialize keyboard listener to get pressed key numbers
//e.preventDefault()
function initializeKeyboardListener() {
	window.addEventListener('keydown', function (e) {
		keyboardInputKey = e.keyCode; 
		keyPressed = true; 
		// block arrows from scrolling
		if (keyboardInputKey && (keyboardInputKey == 38 || keyboardInputKey == 40)) {
			e.preventDefault();
		}
	})
	window.addEventListener('keyup', function (e) {keyboardInputKey = false; keyPressed = false;})
	// evaluate function evaluateKeyboardInput every 20 milliseconds
	setInterval(evaluateKeyboardInput, 20);
};

// initialize paddles and ball
function createComponents() {
	paddleLeft = new Paddle(sizePaddleLeftX, sizePaddleLeftY, colorPaddleLeft, distancePaddle, canvas.height/2-sizePaddleLeftY/2, canvas);
	paddleRight = new Paddle(sizePaddleRightX, sizePaddleRightY, colorPaddleRight, canvas.width-sizePaddleRightX-distancePaddle, (canvas.height-sizePaddleRightY)/2, canvas); 
	ball = new Ball(sizeBall, sizeBall, colorBall, (canvas.width-sizeBall)/2, (canvas.height-sizeBall)/2, canvas); 
 }

// visualize componets
function drawComponents() {
	paddleLeft.draw();
	paddleRight.draw();
	ball.draw();
}

// draw life bar with color gradient and overlay player points
function drawLifes() {
	let grd = ctxLife.createLinearGradient(0, canvasLife.height, canvasLife.width, canvasLife.height);
	grd.addColorStop(0, "black");
	grd.addColorStop(1, "white");
	ctxLife.fillStyle = grd;
	ctxLife.fillRect(0, canvasLife.height-50, canvasLife.width*numberOfCurrentLifes/numberOfInitialLifes, 50);
	// text for player points
	ctxLife.font = "50px Minecraft";
	ctxLife.fillStyle = "white";
	ctxLife.textAlign = "center";
	ctxLife.fillText(playerPoints, canvasLife.width/2, canvasLife.height/2+19);
}

// text for start page
function drawStartFrame() {
	ctx.font = "25px Minecraft";
	ctx.textAlign = "center";
	ctx.fillText("PRESS   S   TO START GAME", canvas.width/2, canvas.height/2+100); 
}

// initialize sound and music
function getSounds() {
	// sounds taken from www.freesound.org
	soundPaddleLeft = new Audio('sounds/457480__tc630__1.wav');
	soundPaddleRight = new Audio('sounds/457480__tc630__1.wav');
	soundLost = new Audio('sounds/159408__noirenex__life-lost-game-over.wav');
	soundGameOver = new Audio('sounds/365782__mattix__game-over-04.wav');
	soundIncreaseSpeed = new Audio('sounds/342744__michael-kur95__increase-01.wav');
	// make to sure to only load once
	if (backgroundMusic === undefined) {
		backgroundMusic = new Audio('sounds/483502__dominikbraun__let-me-see-ya-bounce-8-bit-music.mp3');
		backgroundMusic.loop = true;
		backgroundMusic.play();
	}
}

// function to trigger game behavior after key presses
function evaluateKeyboardInput() {
	// if input field for highscore name is visible, game controls are not active
	if (visibilityHighscore) {
		// after pressing ENTER submit Name
		if (keyboardInputKey && keyboardInputKey == 13) {
			submitHighscoreName(); 
		}
	} else {
	// assing keyboard values
		switch (keyboardInputKey) {
			// ESC to clear local storage (for test purpose)
			case 27:
			try {
				localStorage.clear();
				console.log("highscore list has been reset");
			} catch(err) {
				console.log ("an error occured during resetting the higscore list: " + err.message);
			}
			break;
			// Continue
			case 67: 
			if (!gameRunning && numberOfCurrentLifes != numberOfInitialLifes && numberOfCurrentLifes != 0) {
				try {
					continueGame();
					console.log("game has been continued");
				} catch(err) {
					console.log ("an error occured during continuing the game: " + err.message);
				}	
			}
			break;
			// Exit
			case 69:
			if (gameRunning && !gameExit) {
				try {
					exitGame();
					console.log("game has been exited");
				} catch(err) {
					console.log ("an error occured during exiting the game: " + err.message);
				}	
			}
			break;
			// Pause
			case 80: 
			if (!gamePause) {
				try {
					pauseGame();
					console.log("game has been paused");
				} catch(err) {
					console.log ("an error occured during pausing the game: " + err.message);
				}
			}
			break;
			// Resume
			case 82:
			if (gamePause) {
				try {
					resumeGame();
					console.log("game has been resumed");
				} catch(err) {
					console.log ("an error occured during resuming the game: " + err.message);
				}
			}
			break;
			// Start
			case 83:
			if (!gameRunning && (numberOfCurrentLifes == numberOfInitialLifes || numberOfCurrentLifes == 0)) {
				try {
					numberOfCurrentLifes = numberOfInitialLifes;
					startGame();
					console.log("game has been started");
				} catch(err) {
					console.log ("an error occured during starting the game: " + err.message);
				}				
			}
			break;
			// G Sound
			case 71:
			if (keyPressed && playSound) {
				playSound = false;
				keyPressed = false;
			} else if (keyPressed && !playSound) {
				playSound = true;
				keyPressed = false;
			}
			break;
			// Musik
			case 77:
			if (keyPressed && playMusic) {
				playMusic = false;
				keyPressed = false;
				try {
					backgroundMusic.pause();
					console.log("music has been paused");
				} catch(err) {
					console.log ("an error occured during pausing the music: " + err.message);
				}
			} else if (keyPressed && !playMusic) {
				try {
					backgroundMusic.play();
					console.log("music has been started");
				} catch(err) {
					console.log ("an error occured during starting the music: " + err.message);
				}	
				keyPressed = false;
				playMusic = true;
			}
			break;		 
			// Yes Exit
			case 89:
			if (gameExit) {
				gameExit = false;
				gameRunning = false;
				try {
					numberOfCurrentLifes = numberOfInitialLifes;
					stopGame();
					clearCanvas();
					initialize();
					console.log("game was exited");
				} catch(err) {
					console.log ("an error occured during exiting the game: " + err.message);
				}	
			}
			break;
			// No Exit
			case 78:
			if (gameExit) {
				try {
					resumeGame();
					gameExit = false;
					console.log("game will continue after exit wish");
				} catch(err) {
					console.log ("an error occured during resuming the game after exit wish: " + err.message);
				}
			}
			break;
		}
	}
}

// hide input field for player name for highscore list 
 function hideHighscoreInput() {
	visibilityHighscore = false;
	document.getElementById("inputHighscoreName").style.visibility = "hidden";
	document.getElementById("inputField").style.visibility = "hidden";
}

// show input field for player name for highscore list 
function getHighscoreName() {
	visibilityHighscore = true;
	// set input to default name
	document.getElementById("NameForHighscore").value = "PLAYER NAME";
	document.getElementById("inputField").style.visibility = "visible";
}
 
// submit name and reorder highscore list
function submitHighscoreName() {
	playerNew_name = document.getElementById('NameForHighscore').value;
	playerNew_points = playerPoints;
	localStorage.setItem("playerNew_name", playerNew_name);
	localStorage.setItem("playerNew_points", playerNew_points);
	reorderHighscore();
	document.getElementById("inputField").style.visibility = "hidden";
	visibilityHighscore = false;
	clearCanvas();
	ctx.fillText("PRESS   S   TO RESTART", canvas.width/2, canvas.height/2+100); 
	playerPoints = 0;
}

// reorder highscore list with new player
function reorderHighscore() {
	// only show 5 players in list
	let i = 4;
	while (i>=0){
		let value = parseInt(localStorage.getItem("player" + i + "_points"));
		if (value < localStorage.getItem("playerNew_points")) {
			localStorage.setItem("player" + (i+1) + "_name", localStorage.getItem("player" + i + "_name"));
			localStorage.setItem("player" + (i+1) + "_points", localStorage.getItem("player" + i + "_points"));
			localStorage.setItem("player" + i + "_name", localStorage.getItem("playerNew_name"));
			localStorage.setItem("player" + i + "_points", localStorage.getItem("playerNew_points"));
		}
		i--;
	}
	// remove data that no new insertion will happen
	localStorage.removeItem('playerNew_name');
	localStorage.removeItem('playerNew_points');
}

// to start game
function startGame() {
    gameRunning = true;
	ballBounceLeft = false;
	ballBounceRight = false;
	resetComponets();
	ball.speedX = speedBall*getRandomStartDirection();
	ball.speedY = (speedBall-2)*getRandomStartDirection();
	// set update interval to start refreshing the canvas at 20 milliseconds
	updateInterval = setInterval(updateGameArea, 20);
}

// pause game
function pauseGame() {
	ball.speedXstart = ball.speedX;
	ball.speedYstart = ball.speedY;
	ball.speedX = 0;
	ball.speedY = 0;
	// hide ball 
	ball.color = "Black";
	gamePause = true;
}

// resume game
function resumeGame() {
	ball.speedX = ball.speedXstart;
	ball.speedY = ball.speedYstart;
	ball.color = colorBall;
	gamePause = false;
}

// continue game (same as starting the game)
function continueGame()	{
	startGame();
}

// exit the game
function exitGame() {
	gameExit = true;
	// first pause than get confirmation
	pauseGame();
}

// stop game
function stopGame() {
	clearInterval(updateInterval);
	clearCanvas();
	ctx.font = "100px Minecraft";
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	// depending on remaining lifes show "you lost" or "game over" when all lifes are gone
	if (numberOfCurrentLifes == 0) {
		if(playSound) {
			soundGameOver.play();
		}
		ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2); 
		ctx.font = "25px Minecraft";
		ctx.fillText("INSERT PLAYER NAME BELOW", canvas.width/2-10, canvas.height/2+100); 
		ctx.fillText("AND CONFIRM WITH ENTER", canvas.width/2-10, canvas.height/2+130); 
		getHighscoreName();
		} else {
		if(playSound) {
			soundLost.play();
		}
		ctx.fillText("YOU LOST", canvas.width/2, canvas.height/2); 
		ctx.font = "25px Minecraft";
		ctx.fillText("PRESS   C   TO CONTINUE", canvas.width/2, canvas.height/2+100); 
		}
	gameRunning = false;
}

// reset componets to start point
function resetComponets() {
	paddleLeft.reset();
	paddleRight.reset();
	ball.reset();
}

// get direction for first ball movement
function getRandomStartDirection() {
	return Math.sign(Math.random()-0.5);
}

// clear canvas
function clearCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctxLife.clearRect(0, 0, canvasLife.width, canvasLife.height);
}

// if ball speeds up show it to player
function showSpeedUp() {
	ctx.font = "75px Minecraft";
	ctx.fillStyle = "grey";
	if(gamePause) {
		// hide text during pause
		ctx.fillStyle = "Black";
	}
	ctx.textAlign = "center";
	ctx.fillText("SPEED UP", canvas.width/2, canvas.height/2); 
}

// function for refreshing the canvas
function updateGameArea() {
	// clear everything
	clearCanvas();
	// set paddle speed to default 0 to make paddle stop
	paddleLeft.speedY = 0;
	// check for arrow movement for paddle 
	if (gameRunning && !gamePause) {
		if (keyboardInputKey && keyboardInputKey == 38) {
			paddleLeft.speedY = -speedPaddleLeft;
			}
		if (keyboardInputKey && keyboardInputKey == 40) {
			paddleLeft.speedY = speedPaddleLeft;
			}
	}
	// update paddle position
	paddleLeft.newPos();
	// assign right paddle to ball height for automatic control in single player mode
	paddleRight.y = ball.y + ball.height/2 - paddleRight.height/2;
	// update paddle position
	paddleRight.newPos();
	// check if ball bounces at top or bottom of canvas
	ball.bounceBackBorder();
	// make sure that ball can only bounce left and right alternately - otherwise wrong reaction
	if (!ballBounceLeft) {
		if(ball.bounceBackPaddleLeft(paddleLeft)) {
			if(playSound) {
				soundPaddleLeft.play();
			}
			ballBounceLeft = true;
			ballBounceRight = false;
			// incline number of ball bounces
			countBounceLeft += 1;
			// assign points
			playerPoints += Math.round(10 * ball.speedX);
			// incline ball speed every given interval
			if (countBounceLeft%intervalBallSpeed == 0) {
				if(playSound) {
					soundIncreaseSpeed.play();
				}
				speedUp = true;
				ball.speedX += 1;
			}
		}
	}
	// make sure that ball can only bounce left and right alternately - otherwise wrong reaction
	if (!ballBounceRight) {
		if(ball.bounceBackPaddleRight(paddleRight)) {
			// reset visual for speed up
			speedUp = false;
			ballBounceLeft = false;
			ballBounceRight = true;
			if(playSound) {
				soundPaddleRight.play();
			}
		}
	}
	// update ball position
	ball.newPos();
	// visualize speed up if true
	if (speedUp) {
		showSpeedUp();
	}
	// draw components
	drawComponents();
	// visualize pause or exiting
	if (gamePause) {
		ctx.font = "100px Minecraft";
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		if (!gameExit) {
			ctx.fillText("PAUSE", canvas.width/2, canvas.height/2); 
			ctx.font = "25px Minecraft";
			ctx.fillText("PRESS   R   TO RESUME", canvas.width/2, canvas.height/2+100); 
		} else {
			ctx.fillText("EXIT", canvas.width/2, canvas.height/2); 
			ctx.font = "25px Minecraft";
			ctx.fillText("PRESS   Y   TO EXIT", canvas.width/2, canvas.height/2+100); 
			ctx.fillText("PRESS   N   TO RETURN", canvas.width/2, canvas.height/2+150); 
		}
	}
	// if ball exits canvas
	if(ball.ballExit()) {
		// decline number of lifes
		numberOfCurrentLifes -= 1;
		// reset number of bounces
		countBounceLeft = 0;
		stopGame();
	}
	// update life bar	
	drawLifes();
}

// paddle componets
class Paddle {
	constructor(width, height, color, x, y, canvasInp) {
		// width and height for visualisation
		this.width = width;
		this.height = height;
		// starting speed for component
		this.speedX = 0;
		this.speedY = 0;
		// position for starting the component
		this.x = x;
		this.xStart = x;
		this.y = y;
		this.yStart = y;
		// color
		this.color = color;
		// canvas in which the component will be drawn
		this.canvasInp = canvasInp;
	}
 	// reset component position to start
	reset() {
		this.x = this.xStart;
		this.y = this.yStart;
	}
	// visualize component
	draw() {
		this.canvasInp.getContext("2d").fillStyle = this.color;
		this.canvasInp.getContext("2d").fillRect(this.x, this.y, this.width, this.height);
	} 
	// update position
	newPos() {
		this.x += this.speedX;
		this.y += this.speedY;
		this.hitEdge();
	}
	// check if component hits top or bottom and assign maximum movement
	hitEdge() {
		var totalBottom = this.canvasInp.height - this.height;
		var totalTop = 0;
		if (this.y > totalBottom - 5) {
			this.y = totalBottom - 5;
		}
		if (this.y < totalTop +5) {
			this.y = totalTop + 5;
		}
	}
} 

class Ball extends Paddle {
	// refer to parent class - only changes are commented
	constructor(width, height, color, x, y, canvasInp) {
		super(width, height, color, x, y, canvasInp);
		this.speedXstart = 0;
		this.speedYstart = 0;
	}
	// do restrict position
	newPos() {
		this.x += this.speedX;
		this.y += this.speedY;
	}
	// if ball bounces convert velocity
	bounceBackBorder() {
		if (this.y  < 0 || this.y > this.canvasInp.height - this.height) {
			this.speedY = -this.speedY;
			}
	}
	// if ball bounces convert velocity
	bounceBackPaddleLeft(paddle) {
		if ( (this.x  <= (paddle.x + paddle.width) ) &&   (this.y >= paddle.y) && ( (this.y + this.height) <= (paddle.y+paddle.height))   )      {
			this.speedX = -this.speedX;
			return true;
		}
	}
	// if ball bounces convert velocity	
	bounceBackPaddleRight(paddle) {
		if ( (this.x + this.width  >= paddle.x ) &&   (this.y >= paddle.y) && (this.y + this.height <= paddle.y+paddle.height)   )      {
			this.speedX = -this.speedX;
			return true;
		}
	}
	ballExit(){
		// if ball exits left return true
		if (this.x + this.width <= 0) {
			return true;
		}
	}
}



