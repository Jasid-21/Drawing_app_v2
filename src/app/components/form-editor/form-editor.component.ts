import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatrixExtract } from '@svgdotjs/svg.js';
import { Shape } from '@svgdotjs/svg.js';
import { constants } from 'src/app/helpers/Objects';
//import DrawControlShape from 'src/app/helpers/functions/DrawControlShape.func';
//import RemoveControlShape from 'src/app/helpers/functions/RemoveControlShape.func';
import { AnimationManagerService } from 'src/app/services/animation-manager.service';
import { LinearSliderComponent } from '../linear-slider/linear-slider.component';
import SliderValues from 'src/app/helpers/types/SliderValues.type';

@Component({
  selector: 'app-form-editor',
  templateUrl: './form-editor.component.html',
  styleUrls: ['./form-editor.component.scss']
})
export class FormEditorComponent implements OnInit {
  @ViewChild('scaleXSlider', {
    static: true
  }) scaleXSlider!: LinearSliderComponent;
  @ViewChild('scaleYSlider', {
    static: true
  }) scaleYSlider!: LinearSliderComponent;

  shapes: Shape[] = [];
  scaleX: number = 1;
  scaleY: number = 1;
  rotate: number = 0;
  translateX: number = 0;
  translateY: number = 0;

  constructor(
    private animationManager: AnimationManagerService,
  ) {}

  ngOnInit(): void {
    this.animationManager.$shapes.subscribe((v) => {
      this.shapes = v.filter(s => s.remember(constants.SELECTED));
      if (!this.shapes.length) return;

      var maxLimitX: number = 0;
      var maxLimitY: number = 0;
      var scaleX: number | undefined = this.shapes[0].transform().scaleX || 1;
      var scaleY: number | undefined = this.shapes[0].transform().scaleY || 1;

      this.shapes.forEach(s => {
        const limitX: number = s.remember(constants.MAX_SCALEX);
        const limitY: number = s.remember(constants.MAX_SCALEY);

        if (limitX > maxLimitX) maxLimitX = limitX;
        if (limitY > maxLimitY) maxLimitY = limitY;

        if (scaleX !== undefined) {
          if (scaleX !== s.transform().scaleX) scaleX = undefined;
        }

        if (scaleY !== undefined) {
          if (scaleY !== s.transform().scaleY) scaleY = undefined;
        }
      });

      this.scaleXSlider.handleMaxInputChanges(maxLimitX || 2);
      this.scaleYSlider.handleMaxInputChanges(maxLimitY || 2);
      this.scaleXSlider.setSelector(scaleX || 0);
      this.scaleYSlider.setSelector(scaleY || 0);
    });
  }

  handleScaleX(v: SliderValues): void {
    console.log(v);
    this.scaleX = v.value;
    this.handleMaxScale(constants.MAX_SCALEX, v.maxValue);
    this.applyTransforms();
  };
  handleScaleY(v: SliderValues): void {
    this.scaleY = v.value;
    this.handleMaxScale(constants.MAX_SCALEY, v.maxValue);
    this.applyTransforms();
  };
  handleRotate(v: number): void {
    this.rotate = v;
    this.applyTransforms();
  };

  applyTransforms(): void {
    const canvas = this.animationManager.canvas;
    if (!canvas) return;

    const ss = this.shapes.filter(s => s.remember(constants.SELECTED));
    ss.forEach(s => {
      const t: MatrixExtract = {
        scaleX: this.scaleX,
        scaleY: this.scaleY,
        rotate: this.rotate,
      };
      this.animationManager.removeControlShape(s);
      s.transform(t);
      this.animationManager.drawControlShape(s.id());
    });
  }

  handleMaxScale(propName: string, v: number): void {
    this.shapes.forEach(s => {
      s.remember(propName, v);
    });
  }
}
