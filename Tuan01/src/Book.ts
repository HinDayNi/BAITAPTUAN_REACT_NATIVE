//6. Create a class Book with attributes title, author, year.
export class Book {
  title: string;
  author: string;
  year: number;

  constructor(title: string, author: string, year: number) {
    this.title = title;
    this.author = author;
    this.year = year;
  }

  displayInfo(): void {
    console.log(
      `Title: ${this.title}, Author: ${this.author}, Year: ${this.year}`
    );
  }
}
