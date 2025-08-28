"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
class Order {
    constructor() {
        this.products = [];
    }
    addProduct(product) {
        this.products.push(product);
    }
    calculateTotal() {
        return this.products.reduce((total, product) => total + product.price, 0);
    }
    showOrder() {
        console.log("Order details:");
        this.products.forEach((p) => console.log(`- ${p.name}: $${p.price}`));
        console.log(`Total Price: $${this.calculateTotal()}`);
    }
}
exports.Order = Order;
