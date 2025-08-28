import { Student } from "./Student";
import { Teacher } from "./Teacher";

//30. Create a class School with list of Students and Teachers. Add method to display info
export class School {
  private students: Student[] = [];
  private teachers: Teacher[] = [];

  addStudent(student: Student): void {
    this.students.push(student);
  }

  addTeacher(teacher: Teacher): void {
    this.teachers.push(teacher);
  }

  displayInfo(): void {
    console.log("=== School Info ===");
    console.log("Students:");
    this.students.forEach((s) => s.showInfo());

    console.log("Teachers:");
    this.teachers.forEach((t) => t.showInfo());
  }
}
