//26. Create a class Order with list of products. Add method to calculate total price
import { Product } from "./Product";

export class Order {
  private products: Product[] = [];

  addProduct(product: Product): void {
    this.products.push(product);
  }

  calculateTotal(): number {
    return this.products.reduce((total, product) => total + product.price, 0);
  }

  showOrder(): void {
    console.log("Order details:");
    this.products.forEach((p) => console.log(`- ${p.name}: $${p.price}`));
    console.log(`Total Price: $${this.calculateTotal()}`);
  }
}
