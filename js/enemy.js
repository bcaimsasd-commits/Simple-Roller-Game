// Do two pixel-boxes touch? Used for enemy-versus-player contact.  
Collide.boxesOverlap = function (x1, y1, w1, h1, x2, y2, w2, h2) {  
  if (x1 + w1 <= x2) { return false; }  
  if (x2 + w2 <= x1) { return false; }  
  if (y1 + h1 <= y2) { return false; }  
  if (y2 + h2 <= y1) { return false; }  
  return true;  
};  
