"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTodo = getTodo;
exports.runTodosSequentially = runTodosSequentially;
exports.runTodosInParallel = runTodosInParallel;
exports.getCompletedTodos = getCompletedTodos;
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
async function getTodo1(id) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }
    catch (err) {
        console.error("Lỗi:", err);
    }
}
async function runTodosSequentially() {
    const ids = [1, 2, 3];
    for (const id of ids) {
        const todo = await getTodo1(id);
        console.log(todo);
    }
}
async function runTodosInParallel() {
    const ids = [1, 2, 3];
    const promises = ids.map((id) => getTodo1(id));
    const todos = await Promise.all(promises);
    console.log(todos);
}
async function getCompletedTodos() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/todos");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const todos = await response.json();
        const completedTodos = todos.filter((todo) => todo.completed === true);
        console.log("Todos đã hoàn thành:", completedTodos);
        return completedTodos;
    }
    catch (err) {
        console.error("Lỗi:", err);
    }
}
