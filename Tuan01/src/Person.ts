//1. Create a class Person with attributes name and age. Write a method to display this information.
export class Person {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  displayInfo(): void {
    console.log(`Name: ${this.name}, Age: ${this.age}`);
  }
}
