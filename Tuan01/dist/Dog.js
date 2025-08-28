"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dog = void 0;
const Animals_1 = require("./Animals");
class Dog extends Animals_1.Animals {
    constructor(name) {
        super(name);
    }
    bark() {
        console.log(`${this.name} says: Woof! Woof!`);
    }
}
exports.Dog = Dog;
