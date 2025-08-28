"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
// 7. Write a class User with private property name and getter/setter.
class User {
    constructor(name) {
        this._name = name;
    }
    get name() {
        return this._name;
    }
    set name(newName) {
        this._name = newName;
    }
    display() {
        console.log(`Name: ${this._name}`);
    }
}
exports.User = User;
