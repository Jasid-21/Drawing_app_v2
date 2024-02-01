import { DrawingSpaceComponent } from "src/app/components/drawing-space/drawing-space.component";
import { constants } from "../Objects";

function MouseUpHandler(this: DrawingSpaceComponent, ev: MouseEvent): void {
  if (!this.mouseDownCoord || !this.canvas) return;
  const mouseMode = this.animationManager.mouseMode;
  const [x0, y0] = this.mouseDownCoord;
  const { x, y } = this.canvas.point(ev.pageX, ev.pageY);

  if (mouseMode == 'default') {
    return;
  }

  if (x0 == x && y0 == y) {
    const index = this.animationManager.craetingShapeIndex;
    if (index < 0) return;
    const figure = this.figures[index];

    if (figure.type != 'path') {
      this.canvas.removeElement(figure);
      this.animationManager.removeFigure(figure);
      this.animationManager.craetingShapeIndex = -1;
    } else { }
  } else {
    this.animationManager.craetingShapeIndex = -1;
  }

  this.animationManager.mouseDown = false;
}

export default MouseUpHandler;
