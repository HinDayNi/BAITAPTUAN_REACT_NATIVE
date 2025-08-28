"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = void 0;
//2. Write a class Student extending Person with an additional attribute grade. Add a method to
//display all info.
const Person_1 = require("./Person");
class Student extends Person_1.Person {
    constructor(name, age, grade = 0) {
        super(name, age);
        this.grade = grade;
    }
    displayInfo() {
        super.displayInfo();
        console.log(`Grade: ${this.grade}`);
    }
    showInfo() {
        console.log(`Student: ${this.name}, Age: ${this.age}`);
    }
}
exports.Student = Student;
