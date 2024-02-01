import Duple from "./Duple.type";
import PointState from "./PointState.type";

type StateChange = {
  figureId: string;
  pointStates: PointState[];
  width?: number;
  height?: number;
  radius?: number;
  radiusX?: number;
  radiusY?: number;

  rotate: number;
  scale: Duple<number>;
  translate: Duple<number>;
}

export default StateChange;
