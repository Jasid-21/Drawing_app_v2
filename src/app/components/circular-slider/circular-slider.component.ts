import { AfterViewInit, Component } from '@angular/core';
import { PointArray } from '@svgdotjs/svg.js';
import { Shape } from '@svgdotjs/svg.js';
import { SVG } from '@svgdotjs/svg.js';
import { Svg } from '@svgdotjs/svg.js';
import { constants } from 'src/app/helpers/Objects';
import Duple from 'src/app/helpers/types/Duple.type';

@Component({
  selector: 'app-circular-slider',
  templateUrl: './circular-slider.component.html',
  styleUrls: ['./circular-slider.component.scss']
})
export class CircularSliderComponent implements AfterViewInit {
  canvas?: Svg;
  canvasWidth: number = 200;
  canvasHeight: number = 200;

  hRadius: number = 50;
  cx: number = this.canvasWidth / 2;
  cy: number = this.canvasHeight / 2;
  angle: number = 0;

  lRadius: number = 8;
  marker?: Shape;

  ngAfterViewInit(): void {
    const c = SVG().addTo('#slider-container')
      .width(this.canvasWidth).height(this.canvasHeight);
    this.canvas = c;

    this.canvas.circle().radius(this.hRadius)
      .cx(this.canvasWidth / 2).cy(this.canvasHeight / 2)
      .stroke({ width: 1.5, color: '#000' }).fill('none');
    const pArray = new PointArray([
      [this.canvasWidth / 2 + 30, this.canvasHeight / 2],
      [this.canvasWidth / 2 + this.hRadius, this.canvasHeight / 2]
    ]);
    this.canvas.line(pArray).stroke({ width: 0.6, color: '#000' });

    const [x, y] = this.calculatePoint(this.angle);
    const marker = this.canvas.circle().radius(this.lRadius).cx(x).cy(y)
      .stroke({ width: 1.5, color: '#b0b' }).fill('#fff');
    marker.mousedown(function(ev: MouseEvent) {
      ev.stopPropagation();

      const p = c.point(ev.pageX, ev.pageY);
      marker.remember(constants.MD_POINT, [p.x, p.y]);
    });

    c.mousemove(function(this: any, ev: MouseEvent) {
      const p0 = marker.remember(constants.MD_POINT);
      if (!p0) return;

      const { x, y } = c.point(ev.pageX, ev.pageY);
      const [x0, y0] = p0;
      const [deltaX, deltaY] = [x - x0, y - y0];
      const p1: Duple<number> = [marker.cx() + deltaX, marker.cy() + deltaY];

      this.angle = this.calculateAngle(p1[0], p1[1]);
      console.log(this.angle)
      const [xf, yf] = this.calculatePoint(this.angle);

      marker.cx(xf).cy(yf);
      marker.remember(constants.MD_POINT, [xf, yf]);
    }.bind(this));
  }

  calculateAngle(x: number, y: number): number {
    const h = Math.sqrt(Math.pow(x - this.cx, 2) + Math.pow(y - this.cy, 2));
    const sin = (y - this.cy) / h;
    return Math.asin(sin);
  }

  calculatePoint(angle: number): Duple<number> {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    return [
      this.hRadius * cos + this.canvasWidth / 2,
      this.hRadius * sin + this.canvasHeight / 2
    ];
  }

  setMarkerPosition(): void {

  }
}
