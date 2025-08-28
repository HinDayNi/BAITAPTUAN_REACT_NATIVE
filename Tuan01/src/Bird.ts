import { Flyable } from "./Flyable";

export class Bird implements Flyable {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  fly(): void {
    console.log(`${this.name} is flying in the sky!`);
  }
}
