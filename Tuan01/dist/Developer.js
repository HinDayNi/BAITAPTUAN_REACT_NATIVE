"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Developer = void 0;
const Employee_1 = require("./Employee");
class Developer extends Employee_1.Employee {
    constructor(name, age, salary, language) {
        super(name, age, salary);
        this.language = language;
    }
    developSoftware() {
        console.log(`${this.name} is coding in ${this.language}.`);
    }
}
exports.Developer = Developer;
