//11. Create a base class Animal. Extend Dog and Cat classes with methods bark() and meow().
export class Animals {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  makeSound(): void {
    console.log(`${this.name} makes a sound.`);
  }

  move(): void {
    console.log(`${this.name} is moving...`);
  }

  protected sound(): void {
    console.log("Some generic animal sound...");
  }

  speak(): void {
    this.sound();
  }
}
