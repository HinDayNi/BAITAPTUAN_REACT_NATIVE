"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Library = void 0;
//15. Create a Library class that can store Book and User objects. Add method to add books
class Library {
    constructor() {
        this.books = [];
        this.users = [];
    }
    // Method thêm sách
    addBook(book) {
        this.books.push(book);
        console.log(`Book "${book.title}" added to library.`);
    }
    // Method thêm user
    addUser(user) {
        this.users.push(user);
        console.log(`User "${user.name}" added to library.`);
    }
    // Hiển thị tất cả sách
    listBooks() {
        console.log("Books in library:");
        this.books.forEach((b) => b.displayInfo());
    }
    // Hiển thị tất cả user
    listUsers() {
        console.log("Users in library:");
        this.users.forEach((u) => u.display());
    }
}
exports.Library = Library;
