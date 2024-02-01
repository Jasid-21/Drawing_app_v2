import { AfterContentInit, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Circle } from '@svgdotjs/svg.js';
import { Svg } from '@svgdotjs/svg.js';
import { SVG } from '@svgdotjs/svg.js';
import Duple from 'src/app/helpers/types/Duple.type';
import SliderValues from 'src/app/helpers/types/SliderValues.type';

@Component({
  selector: 'app-linear-slider',
  templateUrl: './linear-slider.component.html',
  styleUrls: ['./linear-slider.component.scss']
})
export class LinearSliderComponent implements AfterViewInit {
  @ViewChild('sliderContainer') sliderContainer!: ElementRef;
  @Output('export-values') exportValues = new EventEmitter<SliderValues>();
  @Input() id!: string;

  canvas?: Svg;
  sliderWidth: number = 160;
  sliderHeight: number = 40;

  selector?: Circle;
  radius: number = 8;

  value: number = 1;
  maxValue: number = 2;

  ngAfterViewInit(): void {
    const c = SVG().addTo('#' + this.sliderContainer.nativeElement.id)
      .width(this.sliderWidth).height(this.sliderHeight);
    this.canvas = c;
    this.canvas.line(
      `${this.radius} ${this.sliderHeight / 2}
      ${this.sliderWidth - this.radius} ${this.sliderHeight / 2}`
    ).stroke({ color: '#000', width: 2 });

    const s = this.canvas.circle().radius(this.radius)
      .cx(this.radius).cy(this.sliderHeight / 2)
      .stroke({ color: '#b0b', width: 1.5 }).fill('#fff');

    s.mousedown(function(ev: MouseEvent) {
      ev.stopPropagation();
      const p = c.point(ev.pageX, ev.pageY);
      s.remember('mousedown-point', [p.x, p.y]);
    });
    c.mousemove(function(this: LinearSliderComponent, ev: MouseEvent) {
      ev.stopPropagation();

      const p0: Duple<number> = s.remember('mousedown-point');
      if (!p0) return;

      const [x0, y0] = p0;
      const { x, y } = c.point(ev.pageX, ev.pageY);

      var [deltaX, deltaY] = [x - x0, y - y0];
      if (x + deltaX > this.sliderWidth - this.radius) {
        s.cx(this.sliderWidth - this.radius);
        s.forget('mousedown-point');

        this.value = this.maxValue;

        return;
      }

      if (x - deltaX < this.radius) {
        s.cx(this.radius);
        s.forget('mousedown-point');

        this.value = 0;

        return;
      }

      const ratio = (x - this.radius) / (this.sliderWidth - 2 * this.radius);
      this.value = Number((ratio * this.maxValue).toFixed(2));
      this.emitValues();

      s.dmove(deltaX, 0);
      s.remember('mousedown-point', [x, y]);
    }.bind(this));
    c.mouseup(function(ev: MouseEvent) {
      s.forget('mousedown-point');
    });
    this.selector = s;

    this.setSelector();
  }

  setSelector(v?: number): void {
    if (!this.selector) return;
    const change = this.value != v;
    if (v !== undefined && !isNaN(v) && v >= 0) this.value = v;

    //* Calculate the position based in values;
    const ratio = this.maxValue > 0 ? this.value / this.maxValue : 0;
    this.selector.cx(ratio * (this.sliderWidth - 2 * this.radius) + this.radius);

    if (change) this.emitValues()
  }

  submit(): void {
    if (this.value > this.maxValue) this.value = this.maxValue;
    this.setSelector();
  }

  handleInputChanges(v: number | null): void {
    if (!v) v = 0;
    if (v > this.maxValue) v = this.maxValue;
  }

  handleMaxInputChanges(v: number | null): void {
    if (!v) v = 0;
    this.maxValue = v;
  }

  emitValues() {
    this.exportValues.emit({ value: this.value, maxValue: this.maxValue });
  }
}
