"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rectangle = void 0;
//4. Create a class Rectangle with width and height. Write a method to calculate area and perimeter.
class Rectangle {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
    // Tính diện tích
    getArea() {
        return this.width * this.height;
    }
    // Tính chu vi
    getPerimeter() {
        return 2 * (this.width + this.height);
    }
    displayInfo() {
        console.log(`Rectangle: width = ${this.width}, height = ${this.height}`);
        console.log(`Area = ${this.getArea()}`);
        console.log(`Perimeter = ${this.getPerimeter()}`);
    }
}
exports.Rectangle = Rectangle;
