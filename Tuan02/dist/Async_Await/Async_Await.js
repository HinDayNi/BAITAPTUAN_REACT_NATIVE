"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helloAsync1 = helloAsync1;
exports.run = run;
exports.simulateTask = simulateTask;
exports.runTask = runTask;
exports.mayFailTask = mayFailTask;
exports.runTask1 = runTask1;
exports.multiplyByThree = multiplyByThree;
exports.run1 = run1;
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
function mayFailTask(shouldFail) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                reject("Có lỗi xảy ra!");
            }
            else {
                resolve("Thành công!");
            }
        }, 1000);
    });
}
async function runTask1(shouldFail) {
    try {
        const result = await mayFailTask(shouldFail);
        console.log("Kết quả:", result);
    }
    catch (err) {
        console.error("Lỗi:", err);
    }
    finally {
        console.log("Done");
    }
}
async function multiplyByThree(num) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(num * 3);
        }, 1000);
    });
}
async function run1() {
    const result = await multiplyByThree(5);
    console.log(result);
}
