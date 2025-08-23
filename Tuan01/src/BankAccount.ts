//5. Create a class BankAccount with balance. Add methods deposit() and withdraw().
export class BankAccount {
  balance: number;

  constructor(initialBalance: number = 0) {
    this.balance = initialBalance;
  }

  // Gửi tiền
  deposit(amount: number): void {
    if (amount > 0) {
      this.balance += amount;
      console.log(`Deposited: ${amount}. New balance = ${this.balance}`);
    } else {
      console.log("Deposit amount must be positive.");
    }
  }

  // Rút tiền
  withdraw(amount: number): void {
    if (amount > this.balance) {
      console.log("Insufficient balance.");
    } else if (amount <= 0) {
      console.log("Withdraw amount must be positive.");
    } else {
      this.balance -= amount;
      console.log(`Withdrawn: ${amount}. New balance = ${this.balance}`);
    }
  }

  // Kiểm tra số dư
  getBalance(): number {
    return this.balance;
  }

  displayInfo() {
    console.log(`Final Balance = ${this.getBalance()}`);
  }
}
