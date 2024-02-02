import { Component, OnInit } from '@angular/core';
import { SVG, Point, Svg } from '@svgdotjs/svg.js';
import '@svgdotjs/svg.panzoom.js';
import '@svgdotjs/svg.draggable.js';
import Figure from 'src/app/helpers/Classes/Figure.class';
import MouseDownHandler from 'src/app/helpers/functions/MouseDownHandler.func';
import MouseMoveHandler from 'src/app/helpers/functions/MouseMoveHandler.func';
import MouseUpHandler from 'src/app/helpers/functions/MouseUpHandler.func';
import Duple from 'src/app/helpers/types/Duple.type';
import { AnimationManagerService } from 'src/app/services/animation-manager.service';
import { Shape } from '@svgdotjs/svg.js';

@Component({
  selector: 'app-drawing-space',
  templateUrl: './drawing-space.component.html',
  styleUrls: ['./drawing-space.component.scss']
})
export class DrawingSpaceComponent implements OnInit {
  figures: Shape[] = [];

  canvas?: Svg;
  canvasWidth: number = 600;
  canvasHeight: number = 500;

  zoomLvl: number = 1;
  center = new Point(this.canvasWidth / 2, this.canvasHeight / 2);

  mouseDownCoord?: Duple<number> = [0, 0];

  constructor(
    public animationManager: AnimationManagerService,
  ) {}

  ngOnInit(): void {
    this.animationManager.$shapes.subscribe((v) => {
      this.figures = v;
    });

    const canvas = SVG().addTo('#drawing-div')
      .size(this.canvasWidth, this.canvasHeight).addClass('canvas')
      .viewbox(`0 0 ${this.canvasWidth} ${this.canvasHeight}`)
      .panZoom({ panning: false, zoomFactor: 0.1 });

    canvas.mousedown(function(this: any, ev: MouseEvent) {
      MouseDownHandler.call(this, ev);
    }.bind(this));

    canvas.mousemove(function(this: any, ev: MouseEvent) {
      MouseMoveHandler.call(this, ev);
    }.bind(this));

    canvas.mouseup(function(this: any, ev: MouseEvent) {
      MouseUpHandler.call(this, ev);
    }.bind(this));

    this.canvas = canvas;
    this.animationManager.setCanvas(this.canvas);

    canvas.rect(this.canvasWidth, this.canvasHeight)
      .stroke({ color: '#ff00ff', dasharray: '5, 5' })
      .attr({ fill: 'none' });
  }

  zoom(scale: number): void {
    if (!this.canvas) return;

    this.zoomLvl += scale;
    this.canvas.zoom(this.zoomLvl, this.center);
  }
}
