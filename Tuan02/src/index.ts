import {
  failProsime,
  getNumber,
  getRandomNumber,
  helloAsync,
} from "./Promise/Prosime";

// helloAsync().then((message) => console.log(message));
// getNumber().then((number) => console.log(number));
// failProsime()
//   .then((result) => console.log(result))
//   .catch((err) => console.log(err.message));
getRandomNumber()
  .then((number) => {
    console.log("Random number:", number);
  })
  .catch((err) => {
    console.log("Error:", err);
  });
