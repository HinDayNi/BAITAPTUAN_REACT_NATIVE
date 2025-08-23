import { BankAccount } from "./BankAccount";
import { Book } from "./Book";
import { Car } from "./Car";
import { Person } from "./Person";
import { Rectangle } from "./Rectangle";
import { Student } from "./Student";
import { User } from "./User";

const person = new Person("Hiền", 21);
const student = new Student("Hiền", 21, 9.0);
const car = new Car("HiHa", "Hiền", 2025);
const rect = new Rectangle(5, 10);
const account = new BankAccount(1000);
const book = new Book("7 viên ngọc rồng", "Toriyama Akira", 2024);
const user = new User("Hiền");

person.displayInfo();

student.displayInfo();

car.showInfo();

rect.displayInfo();

account.deposit(500);
account.withdraw(200);
account.displayInfo();

book.displayInfo();

user.displayInfo();
