import { Rect, Circle, Ellipse, Path } from "@svgdotjs/svg.js";
import { DrawingSpaceComponent } from "src/app/components/drawing-space/drawing-space.component";

function MouseMoveHandler(this: DrawingSpaceComponent, ev: MouseEvent): void {
  const figureIndex = this.animationManager.craetingShapeIndex;
  const mouseDown = this.animationManager.mouseDown;
  if (!this.canvas) return;

  if (figureIndex >= 0) {
    if (!this.mouseDownCoord) return;

    const { x, y } = this.canvas.point(ev.pageX, ev.pageY);
    const [x0, y0] = this.mouseDownCoord;
    const figure = this.figures[figureIndex];

    const [deltaX, deltaY] = [x - x0, y - y0];

    if (figure instanceof Path) {
      if (!mouseDown) {
        const s = figure;
        const d = s.array();

        d[d.length - 1].splice(d[d.length - 1].length - 2, 1, x)
        d[d.length - 1].splice(d[d.length - 1].length - 1 , 1, y)

        s.attr({ d });

      } else {

      }

      return;
    }

    if (figure instanceof Circle) {
      const h = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

      figure.radius(h);
    }

    if (figure instanceof Rect) {
      figure.x(Math.min(x, x0)).y(Math.min(y, y0))
      .width(Math.abs(deltaX)).height(Math.abs(deltaY));
    }

    if (figure instanceof Ellipse) {
      figure.rx(Math.abs(deltaX)).ry(Math.abs(deltaY));
    }

    return;
  }
}

export default MouseMoveHandler;
