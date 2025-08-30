"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helloAsync = helloAsync;
exports.getNumber = getNumber;
exports.failProsime = failProsime;
exports.getRandomNumber = getRandomNumber;
exports.simulateTask = simulateTask;
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
function failProsime() {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error("Something went wrong"));
        }, 1000);
    });
}
function getRandomNumber() {
    return new Promise((resolve, reject) => {
        const number = Math.random();
        if (number < 0.9) {
            resolve(number);
        }
        else {
            reject("Số lượng quá lớn.");
        }
    });
}
function simulateTask(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Hoàn thành nhiệm vụ");
        }, time);
    });
}
