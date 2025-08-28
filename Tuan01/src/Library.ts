import { Book } from "./Book";
import { User } from "./User";

//15. Create a Library class that can store Book and User objects. Add method to add books
export class Library {
  private books: Book[] = [];
  private users: User[] = [];

  // Method thêm sách
  addBook(book: Book): void {
    this.books.push(book);
    console.log(`Book "${book.title}" added to library.`);
  }

  // Method thêm user
  addUser(user: User): void {
    this.users.push(user);
    console.log(`User "${user.name}" added to library.`);
  }

  // Hiển thị tất cả sách
  listBooks(): void {
    console.log("Books in library:");
    this.books.forEach((b) => b.displayInfo());
  }

  // Hiển thị tất cả user
  listUsers(): void {
    console.log("Users in library:");
    this.users.forEach((u) => u.display());
  }
}
