export interface Position {
  x: number;
  y: number;
  z: number;
  lat: number;
  long: number;
  u: number;
  sqrt: number;
}

export interface Options {
  radius: number;
  connections: number;
  distance: number;
  linesOpacity: number;
  height: number;
  dots: boolean;
  amount: number;
  dotsSize: number;
  dotsOpacity: number;
  strokesColor: string;
  dotsColor: string;
  backgroundColor: string;
  Download?: () => void;
}
