// 10. Create a class Account with public, private and readonly fields.

export class Account {
  public username: string;
  private password: string;
  readonly id: number;

  constructor(id: number, username: string, password: string) {
    this.id = id;
    this.username = username;
    this.password = password;
  }

  // Getter cho password
  getPassword(): string {
    return this.password;
  }
}
