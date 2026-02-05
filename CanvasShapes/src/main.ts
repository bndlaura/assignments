import { IShape } from "./shapes/IShape";
import { Circle } from "./shapes/Circle";
import { Square } from "./shapes/Square";
import { Triangle } from "./shapes/Triangle";
import { randomInt, randomColor } from "./utils/random";
import { drawAll } from "./canvas/drawing";
import { setupDragAndDrop } from "./canvas/dragDrop";

const canvas = document.getElementById('draw') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const titleEl = document.getElementById('title') as HTMLElement | null;

const shapes: IShape[] = [];

function placeRandomShape(shape: string) {
  const padding = 50;
  const x = randomInt(padding, canvas.width - padding);
  const y = randomInt(padding, canvas.height - padding);
  const size = randomInt(20, 80);
  const color = randomColor();

  let obj: IShape;

  if (shape === 'circle') obj = new Circle(x, y, size, color);
  else if (shape === 'square') obj = new Square(x, y, size, color);
  else obj = new Triangle(x, y, size, color);

  shapes.push(obj);
  drawAll(ctx, shapes);
  //obj.draw(ctx)
}

document.querySelectorAll<HTMLButtonElement>('.shape-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const shape = btn.dataset.shape;
    if (shape) {
      placeRandomShape(shape);
      if (titleEl) {
        const name =
          shape === 'circle' ? 'Circle' : shape === 'square' ? 'Square' : 'Triangle';
        titleEl.textContent = `${name} created`;
      }
    }
  });
});

setupDragAndDrop(canvas, ctx, shapes);

function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  drawAll(ctx, shapes);
  updateLegend();
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

canvas.addEventListener('dblclick', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  for (let i = shapes.length - 1; i >= 0; i--) {
    if (shapes[i].contains(mx, my)) {
      shapes.splice(i, 1); // detele shape
      drawAll(ctx, shapes);
      if (titleEl) titleEl.textContent = 'Shape deleted';
      return;
    }
  }

  shapes.length = 0;
  drawAll(ctx, shapes);
  if (titleEl) titleEl.textContent = 'Canvas cleared';
});

function updateLegend() {
  const windowWidthEl = document.getElementById('windowWidth');
  const windowHeightEl = document.getElementById('windowHeight');
  const canvasWidthEl = document.getElementById('canvasWidth');
  const canvasHeightEl = document.getElementById('canvasHeight');

  if (windowWidthEl) windowWidthEl.textContent = String(window.innerWidth);
  if (windowHeightEl) windowHeightEl.textContent = String(window.innerHeight);
  if (canvasWidthEl) canvasWidthEl.textContent = String(canvas.width);
  if (canvasHeightEl) canvasHeightEl.textContent = String(canvas.height);
}

window.addEventListener('mousemove', (event) => {
  const pageScrollXEl = document.getElementById('pageScrollX');
  const pageScrollYEl = document.getElementById('pageScrollY');

  if (pageScrollXEl) pageScrollXEl.textContent = String(event.pageX);
  if (pageScrollYEl) pageScrollYEl.textContent = String(event.pageY);
});
