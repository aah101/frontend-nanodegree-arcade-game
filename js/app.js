// Enemies our player must avoid
var Enemy = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.x = x;
    this.y = y;
    this.speed = Math.floor((Math.random() * 400) + 100);
    this.sprite = 'images/enemy-bug.png';
};

//set number of lives and crosses in a global variable
var lives = 3;
var crosses = 0;

// enemy has its own reset method, so does player, so why this? does it do anything?
// Player.prototype.reset = function() {
//   player.x = 200;
//   player.y = 400;
//   //rock.prototype.render();
// }


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticksf
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;
    if (this.x > 505) {
        this.reset()
    }
    //if player and enemy collide call roadkil function 
    if (player.x >= this.x - 35 && player.x <= this.x + 35) {
        if (player.y >= this.y - 40 && player.y <= this.y + 40) {
            roadKill()
        }
    }

    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

//reset the enemy to start after leaving the canvas
Enemy.prototype.reset = function() {
    this.x = -100;
    this.y = this.y
    this.speed = Math.floor((Math.random() * 400) + 100);
};


// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
//set random x coordinate for rocks 
function randomX(set) {
    var random = Math.floor(Math.random() * set.length);
    return set[random];
}

//set random y coordinate for rocks
function randomY(set) {
    var random = Math.floor(Math.random() * set.length);
    return set[random];
}

//create rocks with one of four set coordinates
var Rock = function(x, y) {
    this.x = randomY([0, 126, 252, 378]);
    this.y = randomX([60, 145, 230, 300]);
    this.width = 30;
    this.height = 30;
    this.sprite = "images/Rock.png";
};

//draw rock on canvas
Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

//reset player after collision, reset position of rocks after each game event
Object.prototype.reset = function() {
    player.x = 200;
    player.y = 400;
    allRocks = [];
for (var i = 0; i < 7; i++) {
    allRocks.push(new Rock());
    }
}

//update rocks, run the check collision function for each frame 
Rock.prototype.update = function(dt) {
    this.dt = dt;
    this.checkCollision();
}

//check for player collision
Rock.prototype.checkCollision = function() {
    // allRocks.forEach(function(rock) {
    if (this.x < player.x + player.width &&
        this.x + this.width > player.x &&
        this.y < player.y + player.height &&
        this.height + this.y > player.y) {
        player.obstacle();
        
    }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 30;
    this.sprite = 'images/char-boy.png';
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    // drawBox(this.x, this.y + 77, 100, 67, "yellowred");
};

Player.prototype.handleInput = function(e) {
    this.ctlKey = e;
};

//create variables for tracking player position
var prevX = [];
var prevY = [];

//keep track of player's previous position
Player.prototype.move = function() {
    prevX = this.x;
    prevY = this.y;
};

// Player.prototype.reset = function(x, y) {
//     this.x = 200;
//     this.y = 400;
// };

//push player back to previous position in collision with rock 
Player.prototype.obstacle = function() {
    this.x = prevX;
    this.y = prevY;
};

//control player movement
Player.prototype.update = function() {

    this.move();

    if (this.ctlKey == 'left' && this.x > 0) {
        this.x = this.x - 50;
    } else if (this.ctlKey == 'up' && this.y > -20) {
        this.y = this.y - 50;
    } else if (this.ctlKey == 'right' && this.x < 400) {
        this.x = this.x + 50;
    } else if (this.ctlKey == 'down' && this.y < 400) {
        this.y = this.y + 50;
    }

    this.ctlKey = null;

    //if player reahces safety, push back to start, increase number of crosses
    if (this.y < -20) {
        reset();
        // reset();
        alert("made it!");
        crosses++;
        document.getElementById("qtyCrosses").value++;
        //if corrses  equals 4, player wins, return to start screen 
        if (crosses === 4) {
            alert("You win!");
            document.getElementById("gameCanvas").style.display = "none";
            document.getElementById("counters").style.display = "none";
            document.getElementById("startScreen").style.display = "block";
            document.getElementById("qtyCrosses").value = 0;
            document.getElementById("qtyLives").value = 3;
            lives = 3;
            crosses = 0;
        }
    }

};

//handle collision with enemy, return to start screen after three hits, player looses
Object.prototype.roadKill = function() {
    alert("roadkill!");
    reset();
    lives--;
    document.getElementById("qtyLives").value -= 1;
    if (lives === 0) {
        document.getElementById("gameCanvas").style.display = "none";
        document.getElementById("counters").style.display = "none";
        document.getElementById("startScreen").style.display = "block";
        document.getElementById("qtyCrosses").value = 0;
        document.getElementById("qtyLives").value = 3;
        lives = 3;
        crosses = 0;
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];

(function setEnemies() {
    allEnemies.push(new Enemy(-40, 60));
    allEnemies.push(new Enemy(-40, 145));
    allEnemies.push(new Enemy(-40, 230));
    allEnemies.push(new Enemy(-40, 300));
}());

//create new player
var player = new Player(200, 400);

//create i number of rocks
var allRocks = [];
for (var i = 0; i < 7; i++) {
    allRocks.push(new Rock());
};


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    }

    player.handleInput(allowedKeys[e.keyCode]);
});