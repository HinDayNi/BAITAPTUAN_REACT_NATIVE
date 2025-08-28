"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Teacher = void 0;
//27. Create a class Teacher that extends Person. Add subject attribute and introduce method.
const Person_1 = require("./Person");
class Teacher extends Person_1.Person {
    constructor(name, age, subject) {
        super(name, age); // gọi constructor Person
        this.subject = subject;
    }
    // override introduce method
    introduce() {
        console.log(`Hi, I'm ${this.name}, ${this.age} years old, and I teach ${this.subject}.`);
    }
    showInfo() {
        console.log(`Teacher: ${this.name}, Subject: ${this.subject}`);
    }
}
exports.Teacher = Teacher;
