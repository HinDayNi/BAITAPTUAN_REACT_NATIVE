import { Payment } from "./Payment";

export class CashPayment implements Payment {
  pay(amount: number): void {
    console.log(`Paid ${amount} in cash.`);
  }
}
