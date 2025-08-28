//14. Create a base class Employee. Extend Manager and Developer with specific methods.
export class Employee {
  constructor(public name: string, public age: number, public salary: number) {}

  displayInfo(): void {
    console.log(`Name: ${this.name}, Age: ${this.age}, Salary: ${this.salary}`);
  }
}
