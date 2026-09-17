/* =====================================================================  
   player.js  --  THE ROLLING CIRCLE.  
   ===================================================================== */  
  
var Player = {  
  x: 0,  
  y: 0,  
  vx: 0,  
  vy: 0,  
  onGround: false,  
  angle: 0,  
  lives: 3,  
  hitState: "normal",  
  hitTimer: 0  
};  
  
// Put the player back at the level's S square.  
Player.reset = function () {  
  Player.x = Level.startX;  
  Player.y = Level.startY;  
  Player.vx = 0;  
  Player.vy = 0;  
  Player.onGround = false;  
  Player.angle = 0;  
  Player.lives = CONFIG.START_LIVES;  
  Player.hitState = "normal";  
  Player.hitTimer = 0;  
};  
  
// Run one frame of player movement.  
Player.update = function () {  
  var size = CONFIG.PLAYER_SIZE;  
  
  // 1. sideways speed  
  Player.vx = 0;  
  if (Input.left)  { Player.vx = -CONFIG.MOVE_SPEED; }  
  if (Input.right) { Player.vx =  CONFIG.MOVE_SPEED; }  
  
  // 2. jump  
  if (Input.jump && Player.onGround) {  
    Player.vy = -CONFIG.JUMP_POWER;  
    Player.onGround = false;  
  }  
  
  // 3. gravity  
  Player.vy = Player.vy + CONFIG.GRAVITY;  
  if (Player.vy > CONFIG.MAX_FALL) { Player.vy = CONFIG.MAX_FALL; }  
  
  // 4. move sideways, stop at walls  
  var stepX = 0;  
  if (Player.vx > 0) { stepX = 1; }  
  if (Player.vx < 0) { stepX = -1; }  
  
  for (var i = 0; i < Math.abs(Player.vx); i++) {  
    if (Collide.hitsSolid(Player.x + stepX, Player.y, size, size)) { break; }  
    Player.x = Player.x + stepX;  
    Player.angle = Player.angle + stepX / CONFIG.PLAYER_RADIUS;  
  }  
  
  // 5. move up or down  
  var stepY = 0;  
  if (Player.vy > 0) { stepY = 1; }  
  if (Player.vy < 0) { stepY = -1; }  
  
  Player.onGround = false;  
  
  for (var j = 0; j < Math.abs(Player.vy); j++) {  
    if (Collide.hitsSolid(Player.x, Player.y + stepY, size, size)) {  
      if (stepY > 0) { Player.onGround = true; }  
      Player.vy = 0;  
      break;  
    }  
    Player.y = Player.y + stepY;  
  }  
  
  // 6. keep inside the left edge  
  if (Player.x < 0) { Player.x = 0; }  
  
  // 7. count down invincibility  
  if (Player.hitState === "invincible") {  
    Player.hitTimer = Player.hitTimer - 1;  
    if (Player.hitTimer <= 0) {  
      Player.hitState = "normal";  
    }  
  }  
};  
  
// Take one hit, unless already flashing.  
Player.takeHit = function () {  
  if (Player.hitState !== "normal") { return; }  
  Player.hitState = "invincible";  
  Player.hitTimer = CONFIG.INVINCIBLE_FRAMES;  
  Player.lives = Player.lives - 1;  
  Game.showMessage("Lives left: " + Player.lives);  
};  
  
// Spikes and enemies cost a life. Falling off ends everything.  
Player.isDead = function () {  
  var size = CONFIG.PLAYER_SIZE;  
  if (Collide.hitsSpike(Player.x, Player.y, size, size)) {  
    Player.takeHit();  
  }  
  if (Player.hitState === "normal" && Player.lives <= 0) { return true; }  
  if (Player.y > CONFIG.CANVAS_H + 200) { return true; }  
  return false;  
};  
  
// Win check.  
Player.hasWon = function () {  
  var size = CONFIG.PLAYER_SIZE;  
  return Collide.hitsFinish(Player.x, Player.y, size, size);  
};  
