//23. Create an interface Payment with method pay(amount). Implement CashPayment and
// CardPayment.
export interface Payment {
  pay(amount: number): void;
}
