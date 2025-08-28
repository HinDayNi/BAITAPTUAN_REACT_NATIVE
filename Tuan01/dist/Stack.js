"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stack = void 0;
//22. Create a class Stack with push, pop, peek, isEmpty methods.
class Stack {
    constructor() {
        this.items = [];
    }
    // Thêm phần tử vào đỉnh stack
    push(item) {
        this.items.push(item);
    }
    // Lấy và xóa phần tử trên đỉnh stack
    pop() {
        return this.items.pop();
    }
    // Xem phần tử trên đỉnh stack mà không xóa
    peek() {
        return this.items[this.items.length - 1];
    }
    // Kiểm tra stack có rỗng không
    isEmpty() {
        return this.items.length === 0;
    }
}
exports.Stack = Stack;
