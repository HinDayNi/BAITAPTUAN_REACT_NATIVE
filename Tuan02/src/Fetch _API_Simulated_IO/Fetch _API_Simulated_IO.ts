export async function getTodo() {
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/todos/1"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Dữ liệu từ API:", data);
  } catch (err) {
    console.error("Lỗi:", err);
  }
}

async function getTodo1(id: number) {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${id}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Lỗi:", err);
  }
}

export async function runTodosSequentially() {
  const ids = [1, 2, 3];
  for (const id of ids) {
    const todo = await getTodo1(id);
    console.log(todo);
  }
}

export async function runTodosInParallel() {
  const ids = [1, 2, 3];
  const promises = ids.map((id) => getTodo1(id));
  const todos = await Promise.all(promises);
  console.log(todos);
}

export async function getCompletedTodos() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const todos = await response.json();

    const completedTodos = todos.filter(
      (todo: { completed: boolean }) => todo.completed === true
    );

    console.log("Todos đã hoàn thành:", completedTodos);
    return completedTodos;
  } catch (err) {
    console.error("Lỗi:", err);
  }
}

export async function postData() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "foo",
        body: "bar",
        userId: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Kết quả POST:", data);
    return data;
  } catch (err) {
    console.error("Lỗi:", err);
  }
}

export function downloadFile(fileName: string) {
  return new Promise((resolve) => {
    console.log(`⏳ Bắt đầu tải file: ${fileName}`);
    setTimeout(() => {
      resolve(`File ${fileName} đã tải xong`);
    }, 3000);
  });
}

export async function runDownload() {
  const message = await downloadFile("example.txt");
  console.log(message);
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runWait() {
  console.log("Bắt đầu chờ 5 giây...");
  await wait(5000);
  console.log("Đã chờ xong 5 giây!");
}

export async function fetchWithRetry(url: string, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.warn(`Lần thử ${attempt} thất bại:`, err);
      if (attempt === retries) {
        throw new Error(`Không thể fetch sau ${retries} lần thử`);
      }
    }
  }
}

export async function run6() {
  try {
    const data = await fetchWithRetry(
      "https://jsonplaceholder.typicode.com/todos/1",
      3
    );
    console.log("Dữ liệu nhận được:", data);
  } catch (err) {
    console.error("Lỗi cuối cùng:", err);
  }
}

export async function asyncTask(id: number) {
  return new Promise((resolve) => {
    const time = Math.floor(Math.random() * 2000) + 1000;
    setTimeout(() => {
      resolve(`Task ${id} done in ${time}ms`);
    }, time);
  });
}

export async function batchProcess() {
  const tasks = [1, 2, 3, 4, 5].map((id) => asyncTask(id));
  try {
    const results = await Promise.all(tasks);
    console.log("Kết quả tất cả tasks:", results);
  } catch (err) {
    console.error("Lỗi:", err);
  }
}
