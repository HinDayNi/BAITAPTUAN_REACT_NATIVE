//13. Create an abstract class Shape with method area(). Implement Square and Circle.
export abstract class Shape {
  abstract area(): number;
  static describe(): void {
    console.log(
      "Shapes are geometric figures like circles, squares, and triangles."
    );
  }
}
