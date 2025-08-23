"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BankAccount_1 = require("./BankAccount");
const Book_1 = require("./Book");
const Car_1 = require("./Car");
const Person_1 = require("./Person");
const Product_1 = require("./Product");
const Rectangle_1 = require("./Rectangle");
const Student_1 = require("./Student");
const User_1 = require("./User");
const person = new Person_1.Person("Hiền", 21);
const student = new Student_1.Student("Hiền", 21, 9.0);
const car = new Car_1.Car("HiHa", "Hiền", 2025);
const rect = new Rectangle_1.Rectangle(5, 10);
const account = new BankAccount_1.BankAccount(1000);
const book = new Book_1.Book("7 viên ngọc rồng", "Toriyama Akira", 2024);
const user = new User_1.User("Hiền");
// Tạo mảng sản phẩm
const products = [
    new Product_1.Product("Pen", 20),
    new Product_1.Product("Notebook", 50),
    new Product_1.Product("Headphones", 200),
    new Product_1.Product("Keyboard", 150),
    new Product_1.Product("Mouse", 80),
];
// Lọc sản phẩm có giá > 100
const filterProduct = products.filter((p) => p.price > 100);
person.displayInfo();
student.displayInfo();
car.showInfo();
rect.displayInfo();
account.deposit(500);
account.withdraw(200);
account.displayInfo();
book.displayInfo();
user.displayInfo();
console.log("Sản phẩm có giá > 100:");
filterProduct.forEach((p) => p.displayInfo());
