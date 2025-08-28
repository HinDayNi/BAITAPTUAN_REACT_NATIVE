"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bike = void 0;
class Bike {
    constructor(brand, model, year, speed) {
        this.brand = brand;
        this.model = model;
        this.year = year;
        this.speed = speed;
    }
    start() {
        console.log(`${this.brand} bike started at speed ${this.speed} km/h.`);
    }
    stop() {
        console.log(`${this.brand} bike stopped.`);
    }
    showInfo() {
        console.log(`Brand: ${this.brand}, Model: ${this.model}, Year: ${this.year}`);
    }
}
exports.Bike = Bike;
