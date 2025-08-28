"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
//17. Write a singleton Logger class that logs messages to console.
class Logger {
    // private constructor để ngăn tạo instance mới
    constructor() { }
    // Lấy instance duy nhất
    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
    // Method log message
    log(message) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${message}`);
    }
}
exports.Logger = Logger;
