import { Swimmable } from "./Swimmable";

export class Fish implements Swimmable {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  swim(): void {
    console.log(`${this.name} is swimming in the water!`);
  }
}
