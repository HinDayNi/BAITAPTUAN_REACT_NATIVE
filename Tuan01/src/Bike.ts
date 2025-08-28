import { Vehicle } from "./Vehicle";

export class Bike implements Vehicle {
  brand: string;
  model: string;
  year: number;
  speed: number;

  constructor(brand: string, model: string, year: number, speed: number) {
    this.brand = brand;
    this.model = model;
    this.year = year;
    this.speed = speed;
  }

  start(): void {
    console.log(`${this.brand} bike started at speed ${this.speed} km/h.`);
  }

  stop(): void {
    console.log(`${this.brand} bike stopped.`);
  }

  showInfo(): void {
    console.log(
      `Brand: ${this.brand}, Model: ${this.model}, Year: ${this.year}`
    );
  }
}
