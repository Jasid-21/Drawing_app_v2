import { DrawingSpaceComponent } from "src/app/components/drawing-space/drawing-space.component";
import { PathArray } from "@svgdotjs/svg.js";
import { Path } from "@svgdotjs/svg.js";
import { Marker } from "@svgdotjs/svg.js";
import { Shape } from "@svgdotjs/svg.js";
import { G } from "@svgdotjs/svg.js";
import Duple from "../types/Duple.type";
import { constants } from "../Objects";

function MouseDownHandler(this: DrawingSpaceComponent, ev: MouseEvent) {
  this.animationManager.mouseDown = true;
  if (!this.canvas) return;
  const mouseMode = this.animationManager.mouseMode;
  const index = this.animationManager.craetingShapeIndex;

  const fill = this.animationManager.defaultFill;
  const stroke = this.animationManager.defaultStroke;
  const strokeWidth = this.animationManager.defaultStrokeWidth;
  const opacity = this.animationManager.defaultOpacity;

  const { x, y } = this.canvas.point(ev.pageX, ev.pageY);
  this.mouseDownCoord = [x, y];

  if (mouseMode == 'default') {
    this.figures.forEach(f => {
      if (!this.canvas) return;
      this.animationManager.removeControlShape(f);
    });

    return;
  }
  var shape: Shape | undefined = undefined;

  if (mouseMode == 'path') {
    const f = this.figures[index];
    if (f && f instanceof Path) {
      const arr = f.array();
      arr.push(['L', x, y]);
    } else {
      const arr = new PathArray([
        ['M', x, y],
        ['L', x, y]
      ]);
      shape = this.canvas.path(arr)
      .marker('start', 20, 20, function(add: Marker) {
        add.circle(20).fill('#0b0');
      })
      .stroke({ color: stroke, width: strokeWidth })
      .attr({ fill, opacity });
    }
  }

  if (mouseMode == 'circle') {
    shape = this.canvas.circle(0).cx(x).cy(y)
      .stroke({ color: stroke, width: strokeWidth })
      .attr({ fill, opacity, });
  }

  if (mouseMode == 'rect') {
    shape = this.canvas.rect(0, 0).x(x).y(y)
      .stroke({ color: stroke, width: strokeWidth })
      .attr({ fill, opacity });
  }

  if (mouseMode == 'ellipse') {
    const e = this.canvas.ellipse()
      .cx(x).cy(y).rx(0).ry(0)
      .stroke({ color: stroke, width: strokeWidth })
      .attr({ fill, opacity });
  }

  if (!shape) return;
  shape.mousedown(function (this: DrawingSpaceComponent, ev: MouseEvent) {
    ev.stopPropagation();

    const p = this.canvas?.point(ev.pageX, ev.pageY);
    shape?.remember(constants.MD_POINT, [p?.x, p?.y]);
  }.bind(this));

  shape.on('dragmove', function(this: DrawingSpaceComponent, ev: any) {
    const mm = this.animationManager.mouseMode;
    if (mm != 'default') {
      ev.preventDefault();
      return;
    }
    shape?.remember(constants.DRAGGING, true);

    const g: G = shape?.remember(constants.CONTROL_G);
    const p: Duple<number> = shape?.remember(constants.MD_POINT);
    if (!g || !p) return;

    if (!this.canvas) return;
    const { pageX, pageY } = ev.detail.event;
    const [x0, y0] = p;
    const { x, y } = this.canvas.point(pageX, pageY);
    const [deltaX, deltaY] = [x - x0, y - y0];

    shape?.remember(constants.MD_POINT, [x, y]);

    g.dmove(deltaX, deltaY);
  }.bind(this));

  shape.click(function(this: any, ev: MouseEvent) {
    if (!shape) return;

    const d = shape.remember(constants.DRAGGING);
    if (d) {
      shape.forget(constants.DRAGGING);
      return;
    }

    this.animationManager.drawControlShape(shape.id());
  }.bind(this));

  shape.draggable();

  this.animationManager.addFigure(shape);
}

export default MouseDownHandler;
