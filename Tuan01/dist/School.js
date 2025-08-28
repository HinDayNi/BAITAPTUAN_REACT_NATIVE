"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.School = void 0;
//30. Create a class School with list of Students and Teachers. Add method to display info
class School {
    constructor() {
        this.students = [];
        this.teachers = [];
    }
    addStudent(student) {
        this.students.push(student);
    }
    addTeacher(teacher) {
        this.teachers.push(teacher);
    }
    displayInfo() {
        console.log("=== School Info ===");
        console.log("Students:");
        this.students.forEach((s) => s.showInfo());
        console.log("Teachers:");
        this.teachers.forEach((t) => t.showInfo());
    }
}
exports.School = School;
