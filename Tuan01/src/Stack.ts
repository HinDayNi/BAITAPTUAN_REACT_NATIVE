//22. Create a class Stack with push, pop, peek, isEmpty methods.
export class Stack<T> {
  private items: T[] = [];

  // Thêm phần tử vào đỉnh stack
  push(item: T): void {
    this.items.push(item);
  }

  // Lấy và xóa phần tử trên đỉnh stack
  pop(): T | undefined {
    return this.items.pop();
  }

  // Xem phần tử trên đỉnh stack mà không xóa
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  // Kiểm tra stack có rỗng không
  isEmpty(): boolean {
    return this.items.length === 0;
  }
}
