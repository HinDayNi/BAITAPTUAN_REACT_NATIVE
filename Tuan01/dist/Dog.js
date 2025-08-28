"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dog = void 0;
const Animals_1 = require("./Animals");
class Dog extends Animals_1.Animals {
    constructor(name) {
        super(name);
    }
    makeSound() {
        console.log(`${this.name} says: gâu gâu!`);
    }
    bark() {
        console.log(`${this.name} says: Woof`);
    }
    sound() {
        console.log("Woof! Woof!");
    }
}
exports.Dog = Dog;
