import Duple from "../types/Duple.type";
import Rotate from "./Rotate.func";
import Scale from "./Scale.funct";

function TransformPoint(
  point: Duple<number>,
  rotate: number,
  scale: Duple<number>,
  origin: Duple<number>
): Duple<number> {
  const coord: Duple<number> = [
    point[0] - origin[0],
    point[1] - origin[1]
  ];

  const scaled = Scale(scale, coord);
  const rotated = Rotate(scaled, rotate);

  return [
    rotated[0] + origin[0],
    rotated[1] + origin[1]
  ]
}

export default TransformPoint;
