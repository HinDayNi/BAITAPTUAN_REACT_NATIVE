"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MathUtil = void 0;
// 18. Create a static class MathUtil with methods add(), subtract(), multiply(), divide().
class MathUtil {
    // Phép cộng
    static add(a, b) {
        return a + b;
    }
    // Phép trừ
    static subtract(a, b) {
        return a - b;
    }
    // Phép nhân
    static multiply(a, b) {
        return a * b;
    }
    // Phép chia
    static divide(a, b) {
        if (b === 0) {
            throw new Error("Cannot divide by zero.");
        }
        return a / b;
    }
}
exports.MathUtil = MathUtil;
