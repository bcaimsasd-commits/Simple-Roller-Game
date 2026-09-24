var Enemy = { list: [] };

Enemy.reset = function () {
  Enemy.list = [];
  for (var row = 0; row < CONFIG.ROWS; row++) {
    for (var col = 0; col < Level.cols; col++) {
      if (Level.charAt(col, row) === "e") {
        Enemy.list.push({ x: col * CONFIG.TILE, y: row * CONFIG.TILE, vx: CONFIG.ENEMY_SPEED });
        Level.grid[row] = Level.grid[row].substring(0, col) + "." + Level.grid[row].substring(col + 1);
      }
    }
  }
};

Enemy.update = function () {
  for (var i = 0; i < Enemy.list.length; i++) {
    var enemy = Enemy.list[i];
    var ahead = enemy.x + (enemy.vx > 0 ? CONFIG.PLAYER_SIZE : 0);
    var groundAhead = Collide.hitsSolid(ahead, enemy.y + CONFIG.PLAYER_SIZE + 4, CONFIG.PLAYER_SIZE, 4);
    var wallAhead = Collide.hitsSolid(ahead, enemy.y + 4, 2, CONFIG.PLAYER_SIZE - 8);
    if (wallAhead || !groundAhead) {
      enemy.vx = -enemy.vx;
    } else {
      enemy.x += enemy.vx;
    }
    if (Collide.boxesOverlap(enemy.x, enemy.y, CONFIG.PLAYER_SIZE, CONFIG.PLAYER_SIZE,
      Player.x, Player.y, CONFIG.PLAYER_SIZE, CONFIG.PLAYER_SIZE)) {
      Player.takeHit();
    }
  }
};

Enemy.draw = function () {
  var ctx = Draw.ctx;
  for (var i = 0; i < Enemy.list.length; i++) {
    var enemy = Enemy.list[i];
    ctx.fillStyle = "#000000";
    ctx.fillRect(enemy.x + 4, enemy.y + 4, CONFIG.PLAYER_SIZE - 8, CONFIG.PLAYER_SIZE - 8);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(enemy.x + (enemy.vx > 0 ? 18 : 8), enemy.y + 10, 6, 6);
  }
};
