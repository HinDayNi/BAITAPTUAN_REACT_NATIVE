"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dog = void 0;
class Dog {
    constructor(name) {
        this.name = name;
    }
    sound() {
        console.log(`${this.name} says: Woof`);
    }
}
exports.Dog = Dog;
