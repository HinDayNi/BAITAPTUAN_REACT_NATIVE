// /20. Write a Vehicle interface and implement it in Car and Bike classes.
export interface Vehicle {
  brand: string;
  model: string;
  year: number;
  speed: number;

  start(): void;
  stop(): void;
  showInfo(): void;
}
