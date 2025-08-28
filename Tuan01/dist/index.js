"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Account_1 = require("./Account");
const BankAccount_1 = require("./BankAccount");
const Book_1 = require("./Book");
const Person_1 = require("./Person");
const Product_1 = require("./Product");
const Rectangle_1 = require("./Rectangle");
const School_1 = require("./School");
const Student_1 = require("./Student");
const Teacher_1 = require("./Teacher");
const User_1 = require("./User");
const person = new Person_1.Person("Hiền", 21);
const student = new Student_1.Student("Hiền", 21, 9.0);
// const car = new Car("HiHa", "Hiền", 2025);
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
// const animals: Animal[] = [new Dog("Chó mực"), new Mouse("Chuột đồng")];
// Tạo tài khoản
const account1 = new Account_1.Account(1, "hien123", "123456");
//Bài 11
// const dog = new Dog("Mực");
// dog.move();
// dog.bark();
// const cat = new Cat("MiMi");
// cat.move();
// cat.meow();
//Bài 12
// const bird = new Bird("Eagle");
// bird.fly();
// const fish = new Fish("Goldfish");
// fish.swim();
//Bài 13
// const square = new Square(5);
// console.log("Square area:", square.area());
// const circle = new Circle(3);
// console.log("Circle area:", circle.area());
//Bài 14
// const manager = new Manager("Hiền", 30, 5000, "IT");
// manager.displayInfo();
// manager.manageTeam();
// const developer = new Developer("An", 25, 4000, "TypeScript");
// developer.displayInfo();
// developer.developSoftware();
//Bài 15
// const library = new Library();
// const book1 = new Book("7 Viên Ngọc Rồng", "Toriyama Akira", 2024);
// const book2 = new Book("Harry Potter", "J.K. Rowling", 2001);
// library.addBook(book1);
// library.addBook(book2);
// const user1 = new User("Hiền");
// library.addUser(user1);
// library.listBooks();
// library.listUsers();
//Bài 16
// Lưu number
// const numberBox = new Box<number>(123);
// numberBox.display(); // Box contains: 123
// numberBox.setValue(456);
// console.log(numberBox.getValue()); // 456
// Lưu string
// const stringBox = new Box<string>("Hello World");
// stringBox.display();
// Lưu object
// const userBox = new Box<{ name: string; age: number }>({
//   name: "Hiền",
//   age: 21,
// });
// userBox.display();
//Bài 17
// Lấy instance duy nhất
// const logger1 = Logger.getInstance();
// const logger2 = Logger.getInstance();
// Cả 2 đều cùng một instance
// console.log(logger1 === logger2); // true
// logger1.log("Application started.");
// logger2.log("Another log message.");
//Bài 18
// console.log("Add: ", MathUtil.add(10, 5)); // 15
// console.log("Subtract: ", MathUtil.subtract(10, 5)); // 5
// console.log("Multiply: ", MathUtil.multiply(10, 5)); // 50
// console.log("Divide: ", MathUtil.divide(10, 5)); // 2
//Bài 19
// const animals: Animals[] = [new Dogs("Mực"), new Cat("MiMi")];
// animals.forEach((animal) => animal.makeSound());
//Bài 20
// const car1 = new Car("Toyota", "Camry", 2022, 120);
// car1.start();
// car1.showInfo();
// car1.stop();
// const bike = new Bike("Yamaha", "R15", 2021, 80);
// bike.start();
// bike.showInfo();
// bike.stop();
//Bài 21
// const vehicleRepo = new Repository<Vehicle>();
// vehicleRepo.add(new Car("Toyota", "Camry", 2022, 120));
// vehicleRepo.add(new Bike("Yamaha", "R15", 2021, 80));
// console.log("All vehicles in repository:");
// vehicleRepo.getAll().forEach((v) => {
//   v.showInfo();
//   v.start();
// });
//Bài 22
// // Stack số
// const numberStack = new Stack<number>();
// numberStack.push(10);
// numberStack.push(20);
// console.log("Top:", numberStack.peek()); // 20
// console.log("Popped:", numberStack.pop()); // 20
// console.log("Is empty?", numberStack.isEmpty()); // false
// // Stack chuỗi
// const stringStack = new Stack<string>();
// stringStack.push("Hello");
// stringStack.push("World");
// console.log("Top:", stringStack.peek()); // World
//Bài 23
// const cash = new CashPayment();
// cash.pay(100);
// const card = new CardPayment("1234-5678-9876-5432");
// card.pay(250);
//Bài 24
// const fan = new Fan();
// fan.turnOn();
// const ac = new AirConditioner();
// ac.turnOn();
//Bài 25
// Shape.describe();
//Bài 26
// const order = new Order();
// order.addProduct(new Product("Laptop", 1200));
// order.addProduct(new Product("Mouse", 25));
// order.addProduct(new Product("Keyboard", 45));
// order.showOrder();
//Bài 27
// const teacher = new Teacher("Alice", 35, "Mathematics");
// teacher.introduce();
//Bài 28
// const dog = new Dog("Buddy");
// dog.speak();
// const cat = new Cat("Kitty");
// cat.speak();
//Bài 29
// const car = new Cars("Toyota");
// const robot = new Robot("R2D2");
// car.move();
// robot.move();
//Bài 30
const school = new School_1.School();
school.addStudent(new Student_1.Student("Alice", 20));
school.addStudent(new Student_1.Student("Bob", 21));
school.addTeacher(new Teacher_1.Teacher("Mr. Smith", 40, "Math"));
school.addTeacher(new Teacher_1.Teacher("Ms. Johnson", 35, "English"));
school.displayInfo();
// person.displayInfo();
// student.displayInfo();
// car.showInfo();
// rect.displayInfo();
// account.deposit(500);
// account.withdraw(200);
// account.displayInfo();
// book.displayInfo();
// user.display();
// console.log("Sản phẩm có giá > 100:");
// filterProduct.forEach((p) => p.displayInfo());
// animals.forEach((p) => p.sound());
// Hiển thị username (public)
// console.log("Username:", account1.username);
// Hiển thị id (readonly)
// console.log("ID:", account1.id);
// Hiển thị password qua getter (private field, không thể truy cập trực tiếp)
// console.log("Password (before):", account1.getPassword());
// Đổi mật khẩu bằng setter
// account1.getPassword();
// console.log("Password (after):", account1.getPassword());
