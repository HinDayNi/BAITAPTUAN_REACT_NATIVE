//4. Create a class Rectangle with width and height. Write a method to calculate area and perimeter.
export class Rectangle {
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  // Tính diện tích
  getArea(): number {
    return this.width * this.height;
  }

  // Tính chu vi
  getPerimeter(): number {
    return 2 * (this.width + this.height);
  }

  displayInfo(): void {
    console.log(`Rectangle: width = ${this.width}, height = ${this.height}`);
    console.log(`Area = ${this.getArea()}`);
    console.log(`Perimeter = ${this.getPerimeter()}`);
  }
}
