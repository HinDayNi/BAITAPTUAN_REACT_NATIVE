"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employee = void 0;
//14. Create a base class Employee. Extend Manager and Developer with specific methods.
class Employee {
    constructor(name, age, salary) {
        this.name = name;
        this.age = age;
        this.salary = salary;
    }
    displayInfo() {
        console.log(`Name: ${this.name}, Age: ${this.age}, Salary: ${this.salary}`);
    }
}
exports.Employee = Employee;
