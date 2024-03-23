export interface IAddLocation {
  name: string;
  latitude: number;
  longitude: number;
}

export interface IUpdateLocation extends IAddLocation {}
