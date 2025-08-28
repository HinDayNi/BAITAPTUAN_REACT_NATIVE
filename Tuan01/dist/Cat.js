"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cat = void 0;
const Animals_1 = require("./Animals");
class Cat extends Animals_1.Animals {
    constructor(name) {
        super(name);
    }
    makeSound() {
        console.log(`${this.name} says: Meow!`);
    }
    meow() {
        console.log(`${this.name} says: Meow~`);
    }
}
exports.Cat = Cat;
