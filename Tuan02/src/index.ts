import { failProsime, getNumber, helloAsync } from "./Promise/Prosime";

// helloAsync().then((message) => console.log(message));
// getNumber().then((number) => console.log(number));
failProsime()
  .then((result) => console.log(result))
  .catch((err) => console.log(err.message));
