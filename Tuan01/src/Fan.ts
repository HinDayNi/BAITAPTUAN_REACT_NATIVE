import { Appliance } from "./Appliance";

export class Fan extends Appliance {
  turnOn(): void {
    console.log("Fan is now running.");
  }
}
