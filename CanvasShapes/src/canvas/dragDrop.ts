import { IShape } from "../shapes/IShape";
import { collidesWithOthers } from "../utils/collision";
import { drawAll } from "./drawing";

export function setupDragAndDrop(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  shapes: IShape[]
) {
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

        drawAll(ctx, shapes);
        return;
        }
    }
    });

    canvas.addEventListener('mousemove', (e) => {
    if (!selectedShape) return;

    const rect = canvas.getBoundingClientRect();
    // poziția mouse-ului relativă la canvas
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    // salvăm poziția anterioară
    const oldX = selectedShape.x;
    const oldY = selectedShape.y;

    // mutăm forma
    selectedShape.x = mx - offsetX;
    selectedShape.y = my - offsetY;

    const collisionEnabled = (document.getElementById('collisionAvoidance') as HTMLInputElement).checked;

    // dacă e coliziune, revenim la poziția anterioară
    if (collisionEnabled && collidesWithOthers(selectedShape, shapes)) {
        selectedShape.x = oldX;
        selectedShape.y = oldY;
    }

    drawAll(ctx, shapes);
    });

    canvas.addEventListener('mouseup', () => { 
    selectedShape = null;
    });

    canvas.addEventListener('mouseleave', () => { 
    selectedShape = null;
    });
}