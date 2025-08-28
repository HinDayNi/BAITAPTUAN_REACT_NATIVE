// 18. Create a static class MathUtil with methods add(), subtract(), multiply(), divide().
export class MathUtil {
  // Phép cộng
  static add(a: number, b: number): number {
    return a + b;
  }

  // Phép trừ
  static subtract(a: number, b: number): number {
    return a - b;
  }

  // Phép nhân
  static multiply(a: number, b: number): number {
    return a * b;
  }

  // Phép chia
  static divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error("Cannot divide by zero.");
    }
    return a / b;
  }
}
