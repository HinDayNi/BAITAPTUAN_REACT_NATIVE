import {
  failProsime,
  getNumber,
  getRandomNumber,
  helloAsync,
  simulateTask,
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

const task1 = simulateTasks("Task 1", 1000); // 1 giây
const task2 = simulateTasks("Task 2", 2000); // 2 giây
const task3 = simulateTasks("Task 3", 1500); // 1.5 giây
Promise.all([task1, task2, task3])
  .then((results) => {
    console.log("Kết quả:", results);
  })
  .catch((err) => {
    console.error("Lỗi:", err);
  });
