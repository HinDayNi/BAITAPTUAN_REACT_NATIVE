import { Animals } from "./Animals";

export class Dogs extends Animals {
  constructor(name: string) {
    super(name);
  }

  makeSound(): void {
    console.log(`${this.name} says: gâu gâu!`);
  }

  dark(): void {
    console.log(`${this.name} says: Woof`);
  }
}
