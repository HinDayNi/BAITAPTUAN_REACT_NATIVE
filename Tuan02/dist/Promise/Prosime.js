"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helloAsync = helloAsync;
function helloAsync() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Hello Async");
        }, 2000);
    });
}
