"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankAccount = void 0;
//5. Create a class BankAccount with balance. Add methods deposit() and withdraw().
class BankAccount {
    constructor(initialBalance = 0) {
        this.balance = initialBalance;
    }
    // Gửi tiền
    deposit(amount) {
        if (amount > 0) {
            this.balance += amount;
            console.log(`Deposited: ${amount}. New balance = ${this.balance}`);
        }
        else {
            console.log("Deposit amount must be positive.");
        }
    }
    // Rút tiền
    withdraw(amount) {
        if (amount > this.balance) {
            console.log("Insufficient balance.");
        }
        else if (amount <= 0) {
            console.log("Withdraw amount must be positive.");
        }
        else {
            this.balance -= amount;
            console.log(`Withdrawn: ${amount}. New balance = ${this.balance}`);
        }
    }
    // Kiểm tra số dư
    getBalance() {
        return this.balance;
    }
    displayInfo() {
        console.log(`Final Balance = ${this.getBalance()}`);
    }
}
exports.BankAccount = BankAccount;
