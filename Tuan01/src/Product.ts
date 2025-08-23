//8. Create a Product class with name, price. Create an array of products and filter products with
//price > 100.
export class Product {
  name: string;
  price: number;

  constructor(name: string, price: number) {
    this.name = name;
    this.price = price;
  }

  displayInfo(): void {
    console.log(`Product Name: ${this.name}, Price: ${this.price}`);
  }
}
