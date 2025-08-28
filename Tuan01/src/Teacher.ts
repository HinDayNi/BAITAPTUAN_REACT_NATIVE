//27. Create a class Teacher that extends Person. Add subject attribute and introduce method.
import { Person } from "./Person";

export class Teacher extends Person {
  subject: string;

  constructor(name: string, age: number, subject: string) {
    super(name, age); // gọi constructor Person
    this.subject = subject;
  }

  // override introduce method
  introduce(): void {
    console.log(
      `Hi, I'm ${this.name}, ${this.age} years old, and I teach ${this.subject}.`
    );
  }
  showInfo(): void {
    console.log(`Teacher: ${this.name}, Subject: ${this.subject}`);
  }
}
