"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Robot = void 0;
class Robot {
    constructor(id) {
        this.id = id;
    }
    move() {
        console.log(`Robot ${this.id} is walking forward.`);
    }
}
exports.Robot = Robot;
