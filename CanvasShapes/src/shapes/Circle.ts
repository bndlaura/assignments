import { IShape } from './IShape';

export class Circle implements IShape {
  constructor(
    public x: number,
    public y: number,
    public size: number,
    public color: string
  ) {}

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2); // desenăm cercul cu raza egală cu jumătate din size
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  contains(px: number, py: number): boolean {
    const dx = px - this.x; //distanta intre punctul de click si centrul cercului pe axa x
    const dy = py - this.y; 
    return dx * dx + dy * dy <= (this.size / 2) ** 2; // verificam daca punctul de click este in interiorul cercului folosind formula distanta^2 <= raza^2
  }
}