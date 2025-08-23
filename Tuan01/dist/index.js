"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Person_1 = require("./Person");
const Student_1 = require("./Student");
const person = new Person_1.Person("Hiền", 21);
const student = new Student_1.Student("Hiền", 21, 9.0);
person.displayInfo();
student.displayInfo();
