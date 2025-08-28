import { Employee } from "./Employee";

export class Manager extends Employee {
  constructor(
    name: string,
    age: number,
    salary: number,
    public department: string
  ) {
    super(name, age, salary);
  }

  manageTeam(): void {
    console.log(`${this.name} is managing the ${this.department} department.`);
  }
}
