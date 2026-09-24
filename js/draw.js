var Draw = {
  canvas: null,
  ctx: null,
  cameraX: 0
};

Draw.setup = function () {
  Draw.canvas = document.getElementById("game");
  Draw.ctx = Draw.canvas.getContext("2d");
};

Draw.updateCamera = function () {
  Draw.cameraX = Player.x - CONFIG.CANVAS_W / 2;
  if (Draw.cameraX < 0) { Draw.cameraX = 0; }
  var furthest = Level.pixelWidth() - CONFIG.CANVAS_W;
  if (furthest < 0) { furthest = 0; }
  if (Draw.cameraX > furthest) { Draw.cameraX = furthest; }
};

Draw.everything = function () {  
  var ctx = Draw.ctx;  
  
  // 1. wipe the screen white  
  ctx.fillStyle = "#ffffff";  
  ctx.fillRect(0, 0, CONFIG.CANVAS_W, CONFIG.CANVAS_H);  
  
  // 2. shift everything left so the camera looks like it moved right  
  ctx.save();  
  ctx.translate(-Draw.cameraX, 0);  
  
  Draw.world();  
  Weapon.draw();
  Enemy.draw();   // draw enemies after the world so they sit on top  
  Draw.player();  
  
  ctx.restore();  
};  

Draw.world = function () {
  var size = CONFIG.TILE;
  var firstCol = Math.floor(Draw.cameraX / size) - 1;
  var lastCol = firstCol + Math.ceil(CONFIG.CANVAS_W / size) + 2;

  for (var row = 0; row < CONFIG.ROWS; row++) {
    for (var col = firstCol; col <= lastCol; col++) {
      var character = Level.charAt(col, row);
      var x = col * size;
      var y = row * size;
      if (character === "#") { Draw.block(x, y, size); }
      if (character === "^") { Draw.spike(x, y, size); }
      if (character === "F") { Draw.finish(x, y, size); }
    }
  }
};

Draw.block = function (x, y, size) {
  var ctx = Draw.ctx;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x, y, size, size);
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = CONFIG.LINE_WIDTH;
  ctx.strokeRect(x + CONFIG.LINE_WIDTH / 2, y + CONFIG.LINE_WIDTH / 2,
    size - CONFIG.LINE_WIDTH, size - CONFIG.LINE_WIDTH);
};

Draw.spike = function (x, y, size) {
  var ctx = Draw.ctx;
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.moveTo(x, y + size);
  ctx.lineTo(x + size / 2, y);
  ctx.lineTo(x + size, y + size);
  ctx.closePath();
  ctx.fill();
};

Draw.finish = function (x, y, size) {
  var ctx = Draw.ctx;
  ctx.fillStyle = "#000000";
  ctx.fillRect(x + size / 2 - 2, y, 4, size);
  ctx.beginPath();
  ctx.moveTo(x + size / 2 + 2, y + 4);
  ctx.lineTo(x + size - 4, y + 12);
  ctx.lineTo(x + size / 2 + 2, y + 20);
  ctx.closePath();
  ctx.fill();
};

Draw.player = function () {
  var ctx = Draw.ctx;
  var radius = CONFIG.PLAYER_RADIUS;
  var centerX = Player.x + CONFIG.PLAYER_SIZE / 2;
  var centerY = Player.y + CONFIG.PLAYER_SIZE / 2;
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = CONFIG.LINE_WIDTH;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.arc(centerX + Math.cos(Player.angle) * radius * CONFIG.DOT_DISTANCE,
    centerY + Math.sin(Player.angle) * radius * CONFIG.DOT_DISTANCE,
    4, 0, Math.PI * 2);
  ctx.fill();
};
