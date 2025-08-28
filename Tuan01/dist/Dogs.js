"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dogs = void 0;
const Animals_1 = require("./Animals");
class Dogs extends Animals_1.Animals {
    constructor(name) {
        super(name);
    }
    makeSound() {
        console.log(`${this.name} says: gâu gâu!`);
    }
    dark() {
        console.log(`${this.name} says: Woof`);
    }
}
exports.Dogs = Dogs;
