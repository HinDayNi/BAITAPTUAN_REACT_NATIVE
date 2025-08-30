import { run } from "./Async_Await/Async_Await";
import {
  examplePromise,
  failProsime,
  filterEvenNumbers,
  getNumber,
  getRandomNumber,
  helloAsync,
  simulateTask,
  simulateTask1,
  simulateTasks,
} from "./Promise/Prosime";

// helloAsync().then((message) => console.log(message));

// getNumber().then((number) => console.log(number));

// failProsime()
//   .then((result) => console.log(result))
//   .catch((err) => console.log(err.message));

// getRandomNumber()
//   .then((number) => {
//     console.log("Random number:", number);
//   })
//   .catch((err) => {
//     console.log("Error:", err);
//   });

// simulateTask(2000).then((message) => console.log(message));

// const task1 = simulateTasks("Task 1", 1000); // 1 giây
// const task2 = simulateTasks("Task 2", 2000); // 2 giây
// const task3 = simulateTasks("Task 3", 1500); // 1.5 giây
// Promise.all([task1, task2, task3])
//   .then((results) => {
//     console.log("Kết quả:", results);
//   })
//   .catch((err) => {
//     console.error("Lỗi:", err);
//   });

// const task1 = simulateTask1("Task 1", 3000);
// const task2 = simulateTask1("Task 2", 1000);
// const task3 = simulateTask1("Task 3", 2000);
// // Sử dụng Promise.race
// Promise.race([task1, task2, task3])
//   .then((firstResult) => {
//     console.log("Kết quả đầu tiên:", firstResult);
//   })
//   .catch((err) => {
//     console.error("Lỗi:", err);
//   });

// const start = Promise.resolve(2);
// start
//   .then((number) => {
//     const square = number * number;
//     console.log(square);
//     return square;
//   })
//   .then((number) => {
//     const double = number * 2;
//     console.log(double);
//     return double;
//   })
//   .then((number) => {
//     const add = number + 1;
//     console.log(add);
//     return add;
//   })
//   .catch((err) => {
//     console.log("Lỗi", err);
//   });

// const numbers = [1, 2, 3, 4, 5, 6];
// filterEvenNumbers(numbers)
//   .then((evens) => {
//     console.log("Số chẵn:", evens);
//   })
//   .catch((err) => {
//     console.error("Lỗi:", err);
//   });

// examplePromise(false) // đổi true để thử trường hợp thất bại
//   .then((result) => console.log("Kết quả:", result))
//   .catch((err) => console.error("Lỗi:", err))
//   .finally(() => console.log("Done"));

// ==== Async_Await
run();
