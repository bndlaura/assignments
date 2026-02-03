const canvas = document.getElementById('draw') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const titleEl = document.getElementById('title') as HTMLElement | null;

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

function drawCircle(x: number, y: number, r: number, color: string) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawSquare(x: number, y: number, size: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(x - size / 2, y - size / 2, size, size);
}

function drawTriangle(x: number, y: number, size: number, color: string) {
  ctx.beginPath();
  ctx.moveTo(x, y - size / 2);
  ctx.lineTo(x - size / 2, y + size / 2);
  ctx.lineTo(x + size / 2, y + size / 2);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function placeRandomShape(shape: string) {
  const padding = 20;
  const x = randomInt(padding, canvas.width - padding);
  const y = randomInt(padding, canvas.height - padding);
  const size = randomInt(20, 100);
  const color = randomColor();

  if (shape === 'circle') drawCircle(x, y, size / 2, color);
  else if (shape === 'square') drawSquare(x, y, size, color);
  else if (shape === 'triangle') drawTriangle(x, y, size, color);
}

document.querySelectorAll<HTMLButtonElement>('.shape-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const shape = btn.dataset.shape;
    if (shape) {
      placeRandomShape(shape);
      if (titleEl) {
        const name = shape === 'circle' ? 'Circle' : shape === 'square' ? 'Square' : 'Triangle';
        titleEl.textContent = `${name} created`;
      }
    }
  });
});


canvas.addEventListener('dblclick', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (titleEl) {
    titleEl.textContent = 'Click a button to add a shape';
  }    
});
