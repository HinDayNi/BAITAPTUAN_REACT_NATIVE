import { Movable } from "./Movable";

export class Cars implements Movable {
  brand: string;

  constructor(brand: string) {
    this.brand = brand;
  }

  move(): void {
    console.log(`${this.brand} car is driving on the road.`);
  }
}
