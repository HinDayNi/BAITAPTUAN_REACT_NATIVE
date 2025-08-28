"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fish = void 0;
class Fish {
    constructor(name) {
        this.name = name;
    }
    swim() {
        console.log(`${this.name} is swimming in the water!`);
    }
}
exports.Fish = Fish;
