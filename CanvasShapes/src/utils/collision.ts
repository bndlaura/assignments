import { IShape }  from "../shapes/IShape";

export function isColliding(a: IShape, b: IShape): boolean { 
  // folosim bounding box pentru detectarea coliziunilor
  const ax1 = a.x - a.size / 2; 
  const ay1 = a.y - a.size / 2; 
  const ax2 = a.x + a.size / 2; 
  const ay2 = a.y + a.size / 2; 
  
  // bounding box pentru shape b
  const bx1 = b.x - b.size / 2; 
  const by1 = b.y - b.size / 2; 
  const bx2 = b.x + b.size / 2; 
  const by2 = b.y + b.size / 2; 
  
  // verificăm dacă cele două boxuri se suprapun
  return !(ax2 < bx1 || ax1 > bx2 || ay2 < by1 || ay1 > by2); 
} 

// verificăm coliziunea unui shape cu toate celelalte
export function collidesWithOthers(shape: IShape, shapes: IShape[]): boolean { 
    return shapes.some(s => s !== shape && isColliding(shape, s)); 
}