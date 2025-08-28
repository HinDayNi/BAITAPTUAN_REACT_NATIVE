import { Account } from "./Account";
import { Animal } from "./Animal";
import { Animals } from "./Animals";
import { BankAccount } from "./BankAccount";
import { Bird } from "./Bird";
import { Book } from "./Book";
import { Box } from "./Box";
import { Car } from "./Car";
import { Cat } from "./Cat";
import { Circle } from "./Circle";
import { Developer } from "./Developer";
import { Dog } from "./Dog";
import { Dogs } from "./Dogs";
import { Fish } from "./Fish";
import { Library } from "./Library";
import { Logger } from "./Logger";
import { Manager } from "./Manager";
import { MathUtil } from "./MathUtil";
import { Mouse } from "./Mouse";
import { Person } from "./Person";
import { Product } from "./Product";
import { Rectangle } from "./Rectangle";
import { Square } from "./Square";
import { Student } from "./Student";
import { User } from "./User";

const person = new Person("Hiền", 21);
const student = new Student("Hiền", 21, 9.0);
const car = new Car("HiHa", "Hiền", 2025);
const rect = new Rectangle(5, 10);
const account = new BankAccount(1000);
const book = new Book("7 viên ngọc rồng", "Toriyama Akira", 2024);
const user = new User("Hiền");

// Tạo mảng sản phẩm
const products: Product[] = [
  new Product("Pen", 20),
  new Product("Notebook", 50),
  new Product("Headphones", 200),
  new Product("Keyboard", 150),
  new Product("Mouse", 80),
];

// Lọc sản phẩm có giá > 100
const filterProduct = products.filter((p) => p.price > 100);

// const animals: Animal[] = [new Dog("Chó mực"), new Mouse("Chuột đồng")];

// Tạo tài khoản
const account1 = new Account(1, "hien123", "123456");

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
const animals: Animals[] = [new Dogs("Mực"), new Cat("MiMi")];
animals.forEach((animal) => animal.makeSound());

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
