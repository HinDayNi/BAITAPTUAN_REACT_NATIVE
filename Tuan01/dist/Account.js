"use strict";
// 10. Create a class Account with public, private and readonly fields.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
class Account {
    constructor(id, username, password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }
    // Getter cho password
    getPassword() {
        return this.password;
    }
}
exports.Account = Account;
