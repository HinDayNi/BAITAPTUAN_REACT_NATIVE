"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
//8. Create a Product class with name, price. Create an array of products and filter products with
//price > 100.
class Product {
    constructor(name, price) {
        this.name = name;
        this.price = price;
    }
    displayInfo() {
        console.log(`Product Name: ${this.name}, Price: ${this.price}`);
    }
}
exports.Product = Product;
