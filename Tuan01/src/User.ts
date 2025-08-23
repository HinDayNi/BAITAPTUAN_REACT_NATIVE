//7. Write a class User with private property name and getter/setter.
export class User {
  private uname: string;

  constructor(name: string) {
    this.uname = name;
  }

  get name(): string {
    return this.uname;
  }

  set name(newName: string) {
    if (newName.trim().length === 0) {
      console.log("Tên không được để trống!");
    } else {
      this.uname = newName;
    }
  }

  displayInfo(): void {
    console.log(`User name: ${this.uname}`);
  }
}
