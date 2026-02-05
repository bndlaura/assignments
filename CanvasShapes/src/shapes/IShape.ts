export interface IShape {
  x: number;
  y: number;
  size: number;
  color: string;
  draw(ctx: CanvasRenderingContext2D): void;
  contains(px: number, py: number): boolean;
}