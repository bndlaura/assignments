import { IShape } from './IShape';

export class Triangle implements IShape {
  constructor(
    public x: number,
    public y: number,
    public size: number,
    public color: string
  ) {}

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y - this.size / 2); // vârful de sus al triunghiului
    ctx.lineTo(this.x - this.size / 2, this.y + this.size / 2); // colțul stânga jos
    ctx.lineTo(this.x + this.size / 2, this.y + this.size / 2); // colțul dreapta jos
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  contains(px: number, py: number): boolean {
    // coordonatele vârfurilor triunghiului
    const x1 = this.x; 
    const y1 = this.y - this.size / 2; 
    const x2 = this.x - this.size / 2; 
    const y2 = this.y + this.size / 2; 
    const x3 = this.x + this.size / 2; 
    const y3 = this.y + this.size / 2; 

    const denom = (y2 - y3)*(x1 - x3) + (x3 - x2)*(y1 - y3); // calculăm determinantul folosind coordonatele vârfurilor
    // calculăm coeficienții baricentrici
    const a = ((y2 - y3)*(px - x3) + (x3 - x2)*(py - y3)) / denom; 
    const b = ((y3 - y1)*(px - x3) + (x1 - x3)*(py - y3)) / denom;
    const c = 1 - a - b; 

    return a >= 0 && b >= 0 && c >= 0; // verificăm dacă punctul de click este în interiorul triunghiului 
  }
}