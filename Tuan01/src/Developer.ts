import { Employee } from "./Employee";

export class Developer extends Employee {
  constructor(
    name: string,
    age: number,
    salary: number,
    public language: string
  ) {
    super(name, age, salary);
  }

  developSoftware(): void {
    console.log(`${this.name} is coding in ${this.language}.`);
  }
}
