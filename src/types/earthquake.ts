export interface Earthquake {
  properties: {
    mag: number;
    place: string;
    time: number;
    url: string;
    title: string;
    alert: string | null;
    tsunami: number;
    depth: number;
  };
  geometry: {
    coordinates: [number, number, number];
  };
  id: string;
}