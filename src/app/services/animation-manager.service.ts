import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Figure from '../helpers/Classes/Figure.class';
import MouseMode from '../helpers/types/MouseMode.type';
import { Shape } from '@svgdotjs/svg.js';
import { Svg } from '@svgdotjs/svg.js';
import { constants } from '../helpers/Objects';
import { G } from '@svgdotjs/svg.js';

@Injectable({
  providedIn: 'root'
})
export class AnimationManagerService {
  canvas?: Svg;

  $shapes = new BehaviorSubject<Shape[]>([]);
  mouseMode: MouseMode = 'rect';

  craetingShapeIndex: number = -1;
  mouseDown: boolean = false;

  defaultFill: string = '#0bb';
  defaultStroke: string = '#000';
  defaultStrokeWidth: number = 0.4;
  defaultOpacity: number = 1;

  constructor() { }

  setCanvas(canvas: Svg): void {
    this.canvas = canvas;
  }

  addFigure(figure: Shape): void {
    const fs = this.$shapes.getValue();
    this.$shapes.next([...fs, figure]);
    this.craetingShapeIndex = fs.length;
  }

  removeFigure(id: Shape): Shape {
    const fs = this.$shapes.getValue();
    this.$shapes.next(fs.filter(f => f != id));

    return fs.filter(f => f.id)[0];
  }

  drawControlShape(shapeId: string): void {
    if (!this.canvas) return;
    const shapes = this.$shapes.getValue();
    const shape = shapes.find(s => s.id() == shapeId);
    if (!shape) return;

    if (shape.remember(constants.SELECTED)) {
      this.removeControlShape(shape);
      return;
    }

    shape.remember(constants.SELECTED, true);
    const { x, y, x2, y2, width, height } = shape.rbox(this.canvas);
    const s = this.canvas.rect(width, height).x(x).y(y).fill('none')
      .stroke({ color: '#0ff', width: 1.5, dasharray: '5, 5' });
    const g = this.canvas.group();
    g.addClass(constants.CONTROL_G);
    g.add(s);

    shape.remember(constants.CONTROL_G, g);
    this.$shapes.next(shapes);
  }

  removeControlShape(shape: Shape | string): void {
    if (!this.canvas) return;

    const shapes = this.$shapes.getValue();
    if (typeof shape == 'string') {
      const s = shapes.find(i => i.id() == shape);
      if (!s) return;

      shape = s;
    }

    const g: G = shape.remember(constants.CONTROL_G);
    if (!g) return;

    this.canvas.removeElement(g);

    shape.remember(constants.SELECTED, false);
    shape.forget(constants.CONTROL_G );
    this.$shapes.next(shapes);
  }
}
