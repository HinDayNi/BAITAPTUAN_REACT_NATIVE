"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Animals = void 0;
//11. Create a base class Animal. Extend Dog and Cat classes with methods bark() and meow().
class Animals {
    constructor(name) {
        this.name = name;
    }
    makeSound() {
        console.log(`${this.name} makes a sound.`);
    }
    move() {
        console.log(`${this.name} is moving...`);
    }
}
exports.Animals = Animals;
