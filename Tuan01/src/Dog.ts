import { Animals } from "./Animals";

export class Dog extends Animals {
  constructor(name: string) {
    super(name);
  }

  makeSound(): void {
    console.log(`${this.name} says: gâu gâu!`);
  }

  bark(): void {
    console.log(`${this.name} says: Woof`);
  }

  protected sound(): void {
    console.log("Woof! Woof!");
  }
}
