"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bird = void 0;
class Bird {
    constructor(name) {
        this.name = name;
    }
    fly() {
        console.log(`${this.name} is flying in the sky!`);
    }
}
exports.Bird = Bird;
