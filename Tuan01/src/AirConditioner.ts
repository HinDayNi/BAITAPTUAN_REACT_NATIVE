import { Appliance } from "./Appliance";

export class AirConditioner extends Appliance {
  turnOn(): void {
    console.log("Air Conditioner is cooling the room.");
  }
}
