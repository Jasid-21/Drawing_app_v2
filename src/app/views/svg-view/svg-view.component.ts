import { Component, OnInit } from '@angular/core';
import gsap from 'gsap';
import { SVG, Svg } from '@svgdotjs/svg.js';
import MouseMode from 'src/app/helpers/types/MouseMode.type';
import { AnimationManagerService } from 'src/app/services/animation-manager.service';

@Component({
  selector: 'app-svg-view',
  templateUrl: './svg-view.component.html',
  styleUrls: ['./svg-view.component.scss']
})
export class SvgViewComponent {
  constructor(
    private animationManager: AnimationManagerService,
  ) {

  }

  setMouseMode(mode: MouseMode): void {
    this.animationManager.mouseMode = mode;
  }
}
