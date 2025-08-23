"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mouse = void 0;
class Mouse {
    constructor(name) {
        this.name = name;
    }
    sound() {
        console.log(`${this.name} says: Chít chít`);
    }
}
exports.Mouse = Mouse;
