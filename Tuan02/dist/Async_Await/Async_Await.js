"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helloAsync1 = helloAsync1;
exports.run = run;
function helloAsync1() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Hello Async");
        }, 2000);
    });
}
// async/await
async function run() {
    try {
        const message = await helloAsync1();
        console.log(message); // sau 2 giây in ra "Hello Async"
    }
    catch (err) {
        console.error("Lỗi:", err);
    }
}
