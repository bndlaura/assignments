const canvas = document.getElementById('draw') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const titleEl = document.getElementById('title') as HTMLElement | null;

interface IShape {
  x: number;
  y: number;
  size: number;
  color: string;
  draw(ctx: CanvasRenderingContext2D): void;
  contains(px: number, py: number): boolean;
}

class Circle implements IShape {
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

class Square implements IShape {
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

class Triangle implements IShape {
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

const shapes: IShape[] = [];

function drawAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  shapes.forEach(shape => shape.draw(ctx));
}

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
  obj.draw(ctx)
}

// Drag and drop functionality
let selectedShape: IShape | null = null;
let offsetX = 0; 
let offsetY = 0;

canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect(); // poziția canvas-ului în pagină
  const mx = e.clientX - rect.left; 
  const my = e.clientY - rect.top;

  for (let i = shapes.length - 1; i >= 0; i--) {
    if (shapes[i].contains(mx, my)) {
      selectedShape = shapes[i];

      // aducem forma în față (z-index)
      shapes.splice(i, 1);
      shapes.push(selectedShape);

      offsetX = mx - selectedShape.x; 
      offsetY = my - selectedShape.y;

      drawAll();
      return;
    }
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (!selectedShape) return;

  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left; 
  const my = e.clientY - rect.top;

  // actualizăm poziția formei selectate
  selectedShape.x = mx - offsetX; 
  selectedShape.y = my - offsetY;

  drawAll();
});

canvas.addEventListener('mouseup', () => { 
  selectedShape = null;
});

canvas.addEventListener('mouseleave', () => { 
  selectedShape = null;
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

function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  drawAll();
  updateLegend();
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomColor() {
  const r = randomInt(0, 255);
  const g = randomInt(0, 255);
  const b = randomInt(0, 255);
  return `rgb(${r}, ${g}, ${b})`;
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

canvas.addEventListener('dblclick', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  for (let i = shapes.length - 1; i >= 0; i--) {
    if (shapes[i].contains(mx, my)) {
      shapes.splice(i, 1); // detele shape
      drawAll();
      if (titleEl) titleEl.textContent = 'Shape deleted';
      return;
    }
  }

  shapes.length = 0;
  drawAll()
  if (titleEl) titleEl.textContent = 'Canvas cleared';
});
