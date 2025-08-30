export function helloAsync1() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Hello Async");
    }, 2000);
  });
}

// async/await
export async function run() {
  try {
    const message = await helloAsync1();
    console.log(message);
  } catch (err) {
    console.error("Lỗi:", err);
  }
}

export function simulateTask(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Hoàn thành nhiệm vụ");
    }, time);
  });
}

export async function runTask() {
  try {
    const result = await simulateTask(2000);
    console.log(result);
  } catch (err) {
    console.error("Lỗi:", err);
  }
}

export function mayFailTask(shouldFail: any) {
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

export async function runTask1(shouldFail: any) {
  try {
    const result = await mayFailTask(shouldFail);
    console.log("Kết quả:", result);
  } catch (err) {
    console.error("Lỗi:", err);
  } finally {
    console.log("Done");
  }
}
