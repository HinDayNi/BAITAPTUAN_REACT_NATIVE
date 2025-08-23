import { Animal } from "./Animal";

export class Mouse implements Animal {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  sound(): void {
    console.log(`${this.name} says: Chít chít`);
  }
}
