"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Prosime_1 = require("./Promise/Prosime");
// helloAsync().then((message) => console.log(message));
// getNumber().then((number) => console.log(number));
(0, Prosime_1.failProsime)()
    .then((result) => console.log(result))
    .catch((err) => console.log(err.message));
