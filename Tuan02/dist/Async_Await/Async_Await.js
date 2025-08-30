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
exports.task1 = task1;
exports.task2 = task2;
exports.task3 = task3;
exports.runTasksSequentially = runTasksSequentially;
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
async function task1() {
    return new Promise((resolve) => {
        setTimeout(() => resolve("Task 1 done"), 1000);
    });
}
async function task2() {
    return new Promise((resolve) => {
        setTimeout(() => resolve("Task 2 done"), 1500);
    });
}
async function task3() {
    return new Promise((resolve) => {
        setTimeout(() => resolve("Task 3 done"), 1000);
    });
}
async function runTasksSequentially() {
    try {
        const result1 = await task1();
        console.log(result1);
        const result2 = await task2();
        console.log(result2);
        const result3 = await task3();
        console.log(result3);
        console.log("All tasks finished sequentially");
    }
    catch (err) {
        console.error("Lỗi:", err);
    }
}
