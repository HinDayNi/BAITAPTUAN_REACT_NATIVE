import { BankAccount } from "./BankAccount";
import { Car } from "./Car";
import { Person } from "./Person";
import { Rectangle } from "./Rectangle";
import { Student } from "./Student";

const person = new Person("Hiền", 21);
const student = new Student("Hiền", 21, 9.0);
const car = new Car("HiHa", "Hiền", 2025);
const rect = new Rectangle(5, 10);
const account = new BankAccount(1000);
person.displayInfo();
student.displayInfo();
car.showInfo();
rect.displayInfo();

account.deposit(500);
account.withdraw(200);
account.displayInfo();
