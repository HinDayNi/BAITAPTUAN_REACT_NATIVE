//17. Write a singleton Logger class that logs messages to console.
export class Logger {
  private static instance: Logger;

  // private constructor để ngăn tạo instance mới
  private constructor() {}

  // Lấy instance duy nhất
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  // Method log message
  public log(message: string): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
  }
}
