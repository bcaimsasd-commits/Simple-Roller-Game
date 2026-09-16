// Draw one whole frame.  
Draw.everything = function () {  
  var ctx = Draw.ctx;  
  
  // 1. wipe the screen white  
  ctx.fillStyle = "#ffffff";  
  ctx.fillRect(0, 0, CONFIG.CANVAS_W, CONFIG.CANVAS_H);  
  
  // 2. shift everything left so the camera looks like it moved right  
  ctx.save();  
  ctx.translate(-Draw.cameraX, 0);  
  
  Draw.world();  
  Enemy.draw();   // draw enemies after the world so they sit on top  
  Draw.player();  
  
  ctx.restore();  
};  
