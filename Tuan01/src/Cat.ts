import { Animals } from "./Animals";

export class Cat extends Animals {
  constructor(name: string) {
    super(name);
  }

  makeSound(): void {
    console.log(`${this.name} says: Meow!`);
  }

  meow(): void {
    console.log(`${this.name} says: Meow~`);
  }
}
