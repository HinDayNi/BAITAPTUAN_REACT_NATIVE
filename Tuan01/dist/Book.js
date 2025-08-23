"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
//6. Create a class Book with attributes title, author, year.
class Book {
    constructor(title, author, year) {
        this.title = title;
        this.author = author;
        this.year = year;
    }
    displayInfo() {
        console.log(`Title: ${this.title}, Author: ${this.author}, Year: ${this.year}`);
    }
}
exports.Book = Book;
