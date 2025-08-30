"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTodo = getTodo;
async function getTodo() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Dữ liệu từ API:", data);
    }
    catch (err) {
        console.error("Lỗi:", err);
    }
}
