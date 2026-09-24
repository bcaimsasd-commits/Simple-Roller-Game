var Weapon = {
  pickups: [],
  shots: [],
  wasThrowing: false
};

Weapon.reset = function () {
  Weapon.pickups = [];
  Weapon.shots = [];
  Weapon.wasThrowing = false;
  for (var row = 0; row < CONFIG.ROWS; row++) {
    for (var col = 0; col < Level.cols; col++) {
      if (Level.charAt(col, row) === "w") {
        Weapon.pickups.push({ x: col * CONFIG.TILE + 4, y: row * CONFIG.TILE + 4 });
        Level.grid[row] = Level.grid[row].substring(0, col) + "." + Level.grid[row].substring(col + 1);
      }
    }
  }
};

Weapon.update = function () {
  for (var i = Weapon.pickups.length - 1; i >= 0; i--) {
    var pickup = Weapon.pickups[i];
    if (Collide.boxesOverlap(pickup.x, pickup.y, 24, 24,
      Player.x, Player.y, CONFIG.PLAYER_SIZE, CONFIG.PLAYER_SIZE)) {
      Weapon.pickups.splice(i, 1);
      Game.showMessage("Shoe collected. Press X to throw it.");
    }
  }

  if (Input.throwWeapon && !Weapon.wasThrowing && Weapon.pickups.length === 0 && Weapon.shots.length === 0) {
    Weapon.shots.push({
      x: Player.x + (Player.vx < 0 ? -24 : CONFIG.PLAYER_SIZE),
      y: Player.y + 8,
      vx: Player.vx < 0 ? -CONFIG.SHOE_SPEED : CONFIG.SHOE_SPEED,
      vy: -2
    });
  }
  Weapon.wasThrowing = Input.throwWeapon;

  for (var shotIndex = Weapon.shots.length - 1; shotIndex >= 0; shotIndex--) {
    var shot = Weapon.shots[shotIndex];
    shot.x += shot.vx;
    shot.y += shot.vy;
    shot.vy += CONFIG.SHOE_GRAVITY;
    if (Collide.hitsSolid(shot.x, shot.y, 24, 12) || shot.x < 0 || shot.x > Level.pixelWidth()) {
      Weapon.shots.splice(shotIndex, 1);
      continue;
    }
    for (var enemyIndex = Enemy.list.length - 1; enemyIndex >= 0; enemyIndex--) {
      var enemy = Enemy.list[enemyIndex];
      if (Collide.boxesOverlap(shot.x, shot.y, 24, 12,
        enemy.x, enemy.y, CONFIG.PLAYER_SIZE, CONFIG.PLAYER_SIZE)) {
        Enemy.list.splice(enemyIndex, 1);
        Weapon.shots.splice(shotIndex, 1);
        Game.showMessage("NPC defeated!");
        break;
      }
    }
  }
};

Weapon.draw = function () {
  var ctx = Draw.ctx;
  ctx.fillStyle = "#8b5a2b";
  for (var i = 0; i < Weapon.pickups.length; i++) {
    ctx.fillRect(Weapon.pickups[i].x, Weapon.pickups[i].y + 10, 24, 10);
    ctx.fillRect(Weapon.pickups[i].x + 8, Weapon.pickups[i].y, 10, 18);
  }
  for (var shotIndex = 0; shotIndex < Weapon.shots.length; shotIndex++) {
    ctx.fillRect(Weapon.shots[shotIndex].x, Weapon.shots[shotIndex].y + 4, 24, 8);
    ctx.fillRect(Weapon.shots[shotIndex].x + 8, Weapon.shots[shotIndex].y, 10, 12);
  }
};