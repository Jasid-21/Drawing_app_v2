import Duple from "../types/Duple.type";
import MatrixByPoint from "./MatrixByPoint.func";

function Rotate(point: Duple<number>, degree: number): Duple<number> {
  const rad = (degree * Math.PI) / 180;
  const matrix: Duple<Duple<number>> = [
    [Math.cos(rad), -Math.sin(rad)],
    [Math.sin(rad), Math.cos(rad)]
  ];

  return MatrixByPoint(matrix, point);
}

export default Rotate;
