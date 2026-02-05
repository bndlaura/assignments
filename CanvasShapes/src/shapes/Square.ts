import { IShape } from "./IShape";

export class Square implements IShape {
  constructor(
    public x: number,
    public y: number,
    public size: number,
    public color: string
  ) {}

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.x - this.size / 2, // desenam pătratul din colțul stânga sus
      this.y - this.size / 2, // astfel încât x și y să fie în centru
      this.size,
      this.size
    );
  }

  contains(px: number, py: number): boolean {
    return (
      // verificăm limitele pătratului
      px >= this.x - this.size / 2 && 
      px <= this.x + this.size / 2 && 
      py >= this.y - this.size / 2 && 
      py <= this.y + this.size / 2
    );
  }
}