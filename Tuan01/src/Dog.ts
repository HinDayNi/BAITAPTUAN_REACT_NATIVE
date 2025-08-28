import { Animals } from "./Animals";

export class Dog extends Animals {
  constructor(name: string) {
    super(name);
  }

  bark(): void {
    console.log(`${this.name} says: Woof! Woof!`);
  }
}
