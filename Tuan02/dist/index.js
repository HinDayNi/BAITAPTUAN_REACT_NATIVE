"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Prosime_1 = require("./Promise/Prosime");
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
(0, Prosime_1.simulateTask)(2000).then((message) => console.log(message));
