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
