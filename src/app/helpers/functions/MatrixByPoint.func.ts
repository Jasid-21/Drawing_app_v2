import Duple from "../types/Duple.type";

function MatrixByPoint(matrix: Duple<Duple<number>>, point: Duple<number>): Duple<number> {
  const [[a, b], [c, d]] = matrix;
  const [x, y] = point;

  return [
    (a * x) + (b * y),
    (c * x) + (d * y)
  ]
}

export default MatrixByPoint;
