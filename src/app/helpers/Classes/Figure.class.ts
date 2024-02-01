import { Shape, MatrixAlias, SvgType } from "@svgdotjs/svg.js";
import GetRandomString from "../functions/GetRandomString.func";
import ShapeType from "../types/ShapeType.type";

class Figure {
  id: string;
  shape: Shape;
  type: ShapeType;

  transforms?: MatrixAlias;

  constructor(svg: Shape, type: ShapeType, transforms?: MatrixAlias) {
    this.id = 'figure_' + GetRandomString();
    this.shape = svg;
    this.type = type;
  }

  transformShape(transforms: MatrixAlias): void {
    this.transforms = transforms;
  }
}

export default Figure;
