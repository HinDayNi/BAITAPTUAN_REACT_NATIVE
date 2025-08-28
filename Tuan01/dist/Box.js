"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Box = void 0;
//16. Create a generic class Box that can store any type of value
class Box {
    constructor(value) {
        this.content = value;
    }
    // Lấy giá trị trong box
    getValue() {
        return this.content;
    }
    // Cập nhật giá trị trong box
    setValue(value) {
        this.content = value;
    }
    // Hiển thị giá trị
    display() {
        console.log("Box contains:", this.content);
    }
}
exports.Box = Box;
