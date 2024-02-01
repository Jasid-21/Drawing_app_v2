import Duple from "../types/Duple.type";
import MatrixByPoint from "./MatrixByPoint.func";

function Scale(ratio: Duple<number>, point: Duple<number>): Duple<number> {
  const [sx, sy] = ratio;
  const matrix: Duple<Duple<number>> = [
    [sx, 0],
    [0, sy]
  ]

  return MatrixByPoint(matrix, point);
}

export default Scale;
