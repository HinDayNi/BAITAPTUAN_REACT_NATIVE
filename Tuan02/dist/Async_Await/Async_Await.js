"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helloAsync1 = helloAsync1;
exports.run = run;
exports.simulateTask = simulateTask;
exports.mayFailTask = mayFailTask;
exports.runTask1 = runTask1;
exports.multiplyByThree = multiplyByThree;
exports.run1 = run1;
exports.task1 = task1;
exports.task2 = task2;
exports.task3 = task3;
exports.runTasksSequentially = runTasksSequentially;
exports.runTasksInParallel = runTasksInParallel;
exports.simulateTask2 = simulateTask2;
exports.runTasks = runTasks;
exports.fetchUser = fetchUser;
exports.run3 = run3;
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
function simulateTask(p0, time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Hoàn thành nhiệm vụ");
        }, time);
    });
}
// export async function runTask() {
//   try {
//     const result = await simulateTask(2000);
//     console.log(result);
//   } catch (err) {
//     console.error("Lỗi:", err);
//   }
// }
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
async function runTasksInParallel() {
    try {
        const results = await Promise.all([task1(), task2(), task3()]);
        console.log("Kết quả tất cả tasks:", results);
    }
    catch (err) {
        console.error("Lỗi:", err);
    }
}
function simulateTask2(name, time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`${name} done`);
        }, time);
    });
}
const tasks = [
    simulateTask2("Task 1", 1000),
    simulateTask2("Task 2", 1500),
    simulateTask2("Task 3", 500),
];
async function runTasks() {
    for await (const result of tasks) {
        console.log(result);
    }
    console.log("Tất cả tasks đã hoàn thành");
}
async function fetchUser(id) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: id,
                name: `User ${id}`,
                email: `user${id}@example.com`,
            });
        }, 1000);
    });
}
async function run3() {
    const user = await fetchUser(1);
    console.log(user);
}
