// =====================================================================  
// enemy.js -- patrolling NPCs that cost you a life on touch  
// =====================================================================  
  
var Enemy = {  
  list: []  
};  
  
// find every "e" in the level and turn it into a real enemy  
Enemy.reset = function () {  
  Enemy.list = [];  
  for (var row = 0; row < CONFIG.ROWS; row++) {  
    for (var col = 0; col < Level.cols; col++) {  
      if (Level.charAt(col, row) === "e") {  
        Enemy.list.push({  
          x: col * CONFIG.TILE,  
          y: row * CONFIG.TILE,  
          vx: CONFIG.ENEMY_SPEED,  
          dirWasDown: false  
        });  
        // clear the tile so it isn't drawn as a block  
        var line = Level.grid[row];  
        Level.grid[row] = line.substring(0, col) + "." + line.substring(col + 1);  
      }  
    }  
  }  
};  
  
// patrol: move, and turn around at a wall or the edge of a drop  
Enemy.update = function () {  
  for (var i = 0; i < Enemy.list.length; i++) {  
    var e = Enemy.list[i];  
    var ahead = e.x + (e.vx > 0 ? CONFIG.PLAYER_SIZE : 0);  
    var footRow = Math.floor((e.y + CONFIG.PLAYER_SIZE + 4) / CONFIG.TILE);  
    var footCol = Math.floor((ahead + (e.vx > 0 ? 4 : -4)) / CONFIG.TILE);  
    var groundAhead = Collide.hitsSolid(footCol * CONFIG.TILE, e.y, 2, CONFIG.PLAYER_SIZE + 8);  
    var wallAhead = Collide.hitsSolid(ahead, e.y + 4, 2, CONFIG.PLAYER_SIZE - 8);  
    if (wallAhead || !groundAhead) {  
      e.vx = -e.vx; // turn around  
    } else {  
      e.x = e.x + e.vx;  
    }  
    // touching the player? cost a life (Player.takeHit handles the flashing)  
    if (Collide.boxesOverlap(e.x, e.y, CONFIG.PLAYER_SIZE, CONFIG.PLAYER_SIZE,  
                             Player.x, Player.y, CONFIG.PLAYER_SIZE, CONFIG.PLAYER_SIZE)) {  
      Player.takeHit();  
    }  
  }  
};  
  
Enemy.draw = function () {  
  var ctx = Draw.ctx;  
  for (var i = 0; i < Enemy.list.length; i++) {  
    var e = Enemy.list[i];  
    // a black square with an angry eye -- fits the black-and-white world  
    ctx.fillStyle = "#000000";  
    ctx.fillRect(e.x + 4, e.y + 4, CONFIG.PLAYER_SIZE - 8, CONFIG.PLAYER_SIZE - 8);  
    ctx.fillStyle = "#ffffff";  
    ctx.fillRect(e.x + (e.vx > 0 ? 18 : 8), e.y + 10, 6, 6);  
  }  
};  
