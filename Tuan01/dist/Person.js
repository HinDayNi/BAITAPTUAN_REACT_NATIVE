"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Person = void 0;
//1. Create a class Person with attributes name and age. Write a method to display this information.
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    displayInfo() {
        console.log(`Name: ${this.name}, Age: ${this.age}`);
    }
}
exports.Person = Person;
