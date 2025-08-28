import { Movable } from "./Movable";

export class Robot implements Movable {
  id: string;

  constructor(id: string) {
    this.id = id;
  }

  move(): void {
    console.log(`Robot ${this.id} is walking forward.`);
  }
}
