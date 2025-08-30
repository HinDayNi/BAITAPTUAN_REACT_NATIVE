"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helloAsync = helloAsync;
exports.getNumber = getNumber;
function helloAsync() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Hello Async");
        }, 2000);
    });
}
function getNumber() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(10);
        }, 1000);
    });
}
