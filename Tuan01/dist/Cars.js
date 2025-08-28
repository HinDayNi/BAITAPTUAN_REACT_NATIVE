"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cars = void 0;
class Cars {
    constructor(brand) {
        this.brand = brand;
    }
    move() {
        console.log(`${this.brand} car is driving on the road.`);
    }
}
exports.Cars = Cars;
