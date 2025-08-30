"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helloAsync1 = helloAsync1;
exports.run = run;
exports.simulateTask = simulateTask;
exports.runTask = runTask;
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
        console.log(message);
    }
    catch (err) {
        console.error("Lỗi:", err);
    }
}
function simulateTask(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Hoàn thành nhiệm vụ");
        }, time);
    });
}
async function runTask() {
    try {
        const result = await simulateTask(2000);
        console.log(result);
    }
    catch (err) {
        console.error("Lỗi:", err);
    }
}
