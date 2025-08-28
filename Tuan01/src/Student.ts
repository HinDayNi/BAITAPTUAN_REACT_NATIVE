//2. Write a class Student extending Person with an additional attribute grade. Add a method to
//display all info.
import { Person } from "./Person";

export class Student extends Person {
  grade: number;

  constructor(name: string, age: number, grade: number = 0) {
    super(name, age);
    this.grade = grade;
  }
  displayInfo(): void {
    super.displayInfo();
    console.log(`Grade: ${this.grade}`);
  }

  showInfo(): void {
    console.log(`Student: ${this.name}, Age: ${this.age}`);
  }
}
