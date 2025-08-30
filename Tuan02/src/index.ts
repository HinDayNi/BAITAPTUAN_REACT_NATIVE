import {
  failProsime,
  getNumber,
  getRandomNumber,
  helloAsync,
  simulateTask,
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

simulateTask(2000).then((message) => console.log(message));
