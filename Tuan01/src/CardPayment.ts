import { Payment } from "./Payment";

export class CardPayment implements Payment {
  private cardNumber: string;

  constructor(cardNumber: string) {
    this.cardNumber = cardNumber;
  }

  pay(amount: number): void {
    console.log(`Paid ${amount} using card ${this.cardNumber}.`);
  }
}
