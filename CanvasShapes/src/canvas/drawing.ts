import { IShape } from "../shapes/IShape";

export function drawAll(ctx: CanvasRenderingContext2D, shapes: IShape[]) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  shapes.forEach(shape => shape.draw(ctx));
}
