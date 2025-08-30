export function helloAsync() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Hello Async");
    }, 2000);
  });
}

export function getNumber() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(10);
    }, 1000);
  });
}

export function failProsime() {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error("Something went wrong"));
    }, 1000);
  });
}

export function getRandomNumber() {
  return new Promise((resolve, reject) => {
    const number = Math.random();
    if (number < 0.9) {
      resolve(number);
    } else {
      reject("Số lượng quá lớn.");
    }
  });
}
