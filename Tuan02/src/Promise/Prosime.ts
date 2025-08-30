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

export function simulateTask(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Hoàn thành nhiệm vụ");
    }, time);
  });
}

export function simulateTasks(name: string, time: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`${name} done`);
    }, time);
  });
}

export function simulateTask1(name: string, time: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`${name} done`);
    }, time);
  });
}

export function filterEvenNumbers(arr: any[]) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const evenNumbers = arr.filter((num) => num % 2 === 0);
      resolve(evenNumbers);
    }, 1000);
  });
}

export function examplePromise(shouldFail: any) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject("Có lỗi xảy ra!");
      } else {
        resolve("Thành công!");
      }
    }, 1000);
  });
}
