//16. Create a generic class Box that can store any type of value
export class Box<T> {
  private content: T;

  constructor(value: T) {
    this.content = value;
  }

  // Lấy giá trị trong box
  getValue(): T {
    return this.content;
  }

  // Cập nhật giá trị trong box
  setValue(value: T): void {
    this.content = value;
  }

  // Hiển thị giá trị
  display(): void {
    console.log("Box contains:", this.content);
  }
}
