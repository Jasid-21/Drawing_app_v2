import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import FromHSLtoCoord from 'src/app/helpers/functions/FromHSLtoCoord.func';
import FromRGBtoHSL from 'src/app/helpers/functions/FromRGBtoHSL.func';
import Duple from 'src/app/helpers/types/Duple.type';

@Component({
  selector: 'app-styles-editor',
  templateUrl: './styles-editor.component.html',
  styleUrls: ['./styles-editor.component.scss']
})
export class StylesEditorComponent implements OnInit {
  @ViewChild('huePicker', { static: true }) hueCanvasRef!: ElementRef;
  @ViewChild('huePointer', { static: true }) huePointerRef!: ElementRef;
  @ViewChild('wbPicker', { static: true }) wbCanvasRef!: ElementRef;
  @ViewChild('wbPointer', { static: true }) wbPointerRef!: ElementRef;
  @ViewChild('opacityPicker', { static: true }) opacityCanvasRef!: ElementRef;
  @ViewChild('opacityPointer', { static: true }) opacityPointerRef!: ElementRef;

  editMode = 'fill';

  hueCanvasWidth: number = 150;
  hueCanvasHeight: number = 50;
  wbCanvasWidth: number = 150;
  wbCanvasHeight: number = 50;

  hueCtx: CanvasRenderingContext2D | null = null;
  huePointerCtx: CanvasRenderingContext2D | null = null;
  wbCtx: CanvasRenderingContext2D | null = null;
  wbPointerCtx: CanvasRenderingContext2D | null = null;
  opacityCtx: CanvasRenderingContext2D | null = null;
  opacityPointerCtx: CanvasRenderingContext2D | null = null;

  huePointerCoord: Duple<number> = [0, 1];
  opacityPointerCoord: Duple<number> = [0, 1];
  wbPointerCoord: Duple<number> = [0, 0];
  prevColor: string = '';
  currentColor: string = '';

  text: string = '';

  hue: number = 0;
  opacity: number = 1;

  constructor(

  ) {}

  ngOnInit(): void {
    const hueCanvas = this.hueCanvasRef.nativeElement as HTMLCanvasElement;
    const huePointer = this.huePointerRef.nativeElement as HTMLCanvasElement;
    this.hueCanvasWidth = hueCanvas.width;
    this.hueCanvasHeight = hueCanvas.height;

    const wbCanvas = this.wbCanvasRef.nativeElement as HTMLCanvasElement;
    const wbPointer = this.wbPointerRef.nativeElement as HTMLCanvasElement;
    this.wbCanvasWidth = wbCanvas.width;
    this.wbCanvasHeight = wbCanvas.height;

    const opacityCanvas = this.opacityCanvasRef.nativeElement as HTMLCanvasElement;
    const opacityPointer = this.opacityPointerRef.nativeElement as HTMLCanvasElement;

    this.hueCtx = hueCanvas.getContext('2d');
    this.huePointerCtx = huePointer.getContext('2d');
    this.wbCtx = wbCanvas.getContext('2d');
    this.wbPointerCtx = wbPointer.getContext('2d');
    this.opacityCtx = opacityCanvas.getContext('2d');
    this.opacityPointerCtx = opacityPointer.getContext('2d');
    if (
      !this.hueCtx || !this.huePointerCtx
    ) return;

    //* Paint the hue canvas.
    const hueFraction = 360 / this.hueCanvasWidth;
    for (var i = 0; i < this.hueCanvasWidth; i++) {
      const deg = i * hueFraction;
      const color =`hsl(${deg}, 100%, 50%)`;
      this.hueCtx.fillStyle = color;
      this.hueCtx.fillRect(i, 0, 1, this.hueCanvasHeight);
    }

    //* Paint the extended canvas.
    this.drawWbCanvas();

    //* Paint the hue selector.
    this.drawHuePickerCanvas(20);

    //* Paint the color selector.
    const color = this.drawWbPickerCanvas(20, 20);
    this.prevColor = color;
    this.currentColor = color;

    //* Paint opacity canvas.
    this.drawOpacityCanvas();

    this.setCoordFromColor('rgba(140,140,140,0.7)');
  }

  setEditMode(mode: string): void {
    this.editMode = mode;
  }

  drawWbCanvas(): void {
    if (!this.wbCtx) return;

    this.wbCtx.clearRect(0, 0, this.wbCanvasWidth, this.wbCanvasHeight);
    const fractionW = 100 / this.wbCanvasWidth;
    const fractionH = 100 / this.wbCanvasHeight;
    for (var i = 0; i < this.wbCanvasHeight; i++) {
      for (var j = 0; j < this.wbCanvasWidth; j++) {
        const w_perc = j * fractionW;
        const h_perc = i * fractionH;
        const color = `hsl(${this.hue}, ${w_perc}%, ${100 - h_perc}%)`;
        this.wbCtx.fillStyle = color;
        this.wbCtx.fillRect(j, i, 1, 1);
      }
    }
  }

  drawWbPickerCanvas(x: number, y: number): string {
    if (!this.wbPointerCtx) return '';

    this.wbPointerCtx.clearRect(0, 0, this.wbCanvasWidth, this.wbCanvasHeight);
    this.wbPointerCtx.beginPath();
    this.wbPointerCtx.arc(x, y, 8, 0, 2 * Math.PI);
    this.wbPointerCtx.lineWidth = 2;
    this.wbPointerCtx.stroke();

    this.wbPointerCoord = [x, y];
    return this.getColorFromCoord();
  }

  drawHuePickerCanvas(x: number): string {
    if (!this.huePointerCtx) return '';

    this.huePointerCtx.clearRect(0, 0, this.hueCanvasWidth, this.hueCanvasHeight);
    this.huePointerCtx.lineWidth = 2;
    this.huePointerCtx.strokeRect(x - 3, 1, 6, this.hueCanvasHeight);

    this.huePointerCoord = [x, 1];
    this.hue = x * 360 / this.hueCanvasWidth;
    this.drawWbCanvas();
    return this.getColorFromCoord();
  }

  drawOpacityCanvas(): void {
    if (!this.opacityCtx) return;

    this.opacityCtx.clearRect(0, 0, this.hueCanvasWidth, this.hueCanvasHeight);
    const fraction = 1 / this.hueCanvasWidth;
    for (var i = 0; i < this.hueCanvasWidth; i++) {
      const op = fraction * i;
      const color = this.getColorFromCoord(undefined, undefined, op);

      this.opacityCtx.fillStyle = color;
      this.opacityCtx.fillRect(i, 0, 1, this.hueCanvasHeight);
    }
  }

  drawOpacityPickerCanvas(x: number): string {
    if (!this.opacityPointerCtx) return '';

    this.opacityPointerCtx.clearRect(0, 0, this.hueCanvasWidth, this.hueCanvasHeight);
    this.opacityPointerCtx.lineWidth = 2;
    this.opacityPointerCtx.strokeRect(x - 3, 1, 6, this.hueCanvasHeight);

    this.opacityPointerCoord = [x, 1];
    this.opacity = x / this.hueCanvasWidth;
    return this.getColorFromCoord();
  }

  getColorFromCoord(wb?: Duple<number>, hue?: number, op?: number): string {
    const [x, y] = wb || this.wbPointerCoord;
    const h = hue || this.huePointerCoord[0] * 360 / this.hueCanvasWidth;
    const opacity = op || this.opacity;
    const s = x * 100 / this.wbCanvasWidth;
    const l = y * 100 / this.wbCanvasHeight;

    return `hsla(${h}, ${s}%, ${100 - l}%, ${opacity})`;
  }

  setCurrentColor(color: string): void {
    this.prevColor = this.currentColor;
    this.currentColor = color;
  }

  setHuePicker(ev: MouseEvent | number, setPrev: boolean = true): void {
    const x = ev instanceof MouseEvent ? ev.offsetX : ev;

    const color = this.drawHuePickerCanvas(x);
    this.hue = x * 100 / this.hueCanvasWidth;

    if (setPrev) this.setCurrentColor(color);
    this.drawOpacityCanvas();
    this.setShapesColor(color);
  }

  setWbPicker(ev: MouseEvent | Duple<number>, setPrev: boolean = true): void {
    const [x, y] = ev instanceof MouseEvent ? [ev.offsetX, ev.offsetY] : ev;
    const color = this.drawWbPickerCanvas(x, y);
    this.wbPointerCoord = [x, y];
    if (setPrev) this.setCurrentColor(color);
    this.drawOpacityCanvas();
    this.setShapesColor(color);
  }

  setOpacityPicker(ev: MouseEvent | number, setPrev: boolean = true): void {
    const x = ev instanceof MouseEvent ? ev.offsetX : ev;

    const color = this.drawOpacityPickerCanvas(x);
    this.opacity = x / this.hueCanvasWidth;

    if (setPrev) this.setCurrentColor(color);
    this.setShapesColor(color);
  }

  setShapesColor(color: string): void {

  }

  setCoordFromColor(color: string) {
    const hsl = color.includes('rgb') ? FromRGBtoHSL(color) : color;
    const [h, x, y, a] = FromHSLtoCoord(hsl, this.wbCanvasWidth, this.wbCanvasHeight);

    this.opacity = a;
    this.setHuePicker(h, false);
    this.setWbPicker([x, y]);
    this.setOpacityPicker(a);
  }
}
