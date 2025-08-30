"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Prosime_1 = require("./Promise/Prosime");
// helloAsync().then((message) => console.log(message));
// getNumber().then((number) => console.log(number));
// failProsime()
//   .then((result) => console.log(result))
//   .catch((err) => console.log(err.message));
(0, Prosime_1.getRandomNumber)()
    .then((number) => {
    console.log("Random number:", number);
})
    .catch((err) => {
    console.log("Error:", err);
});
