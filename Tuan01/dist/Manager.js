"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manager = void 0;
const Employee_1 = require("./Employee");
class Manager extends Employee_1.Employee {
    constructor(name, age, salary, department) {
        super(name, age, salary);
        this.department = department;
    }
    manageTeam() {
        console.log(`${this.name} is managing the ${this.department} department.`);
    }
}
exports.Manager = Manager;
