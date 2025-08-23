import { Animal } from "./Animal";

export class Dog implements Animal {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  sound(): void {
    console.log(`${this.name} says: Woof`);
  }
}
