"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
//7. Write a class User with private property name and getter/setter.
class User {
    constructor(name) {
        this.uname = name;
    }
    get name() {
        return this.uname;
    }
    set name(newName) {
        if (newName.trim().length === 0) {
            console.log("Tên không được để trống!");
        }
        else {
            this.uname = newName;
        }
    }
    displayInfo() {
        console.log(`User name: ${this.uname}`);
    }
}
exports.User = User;
