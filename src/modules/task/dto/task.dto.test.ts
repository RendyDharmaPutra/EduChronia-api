import { describe, it, expect } from "bun:test";
import { createTaskDto } from "./task.dto";

describe("CreateTaskDto", () => {
  it("should pass with valid data", () => {
    const result = createTaskDto.safeParse({
      title: "Tugas Matematika",
      description: "Mengerjakan soal dari halaman 10 sampai 15",
      deadline: new Date(),
      isCompleted: false,
      courseId: 1,
    });

    expect(result.success).toBe(true);
  });

  // title validation
  it("should fail if title is too short", () => {
    const result = createTaskDto.safeParse({
      title: "A",
      deadline: new Date(),
      courseId: 1,
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Nama Tugas harus minimal 2 karakter",
      );
    }
  });

  it("should fail if title is empty after trim", () => {
    const result = createTaskDto.safeParse({
      title: "         ",
      deadline: new Date(),
      courseId: 1,
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Nama Tugas harus diisi");
    }
  });

  it("should fail if title exceeds max length", () => {
    const result = createTaskDto.safeParse({
      title: "A".repeat(151),
      deadline: new Date(),
      courseId: 1,
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Nama Tugas harus maksimal 150 karakter",
      );
    }
  });

  // description validation
  it("should pass without description", () => {
    const result = createTaskDto.safeParse({
      title: "Tugas Fisika",
      deadline: new Date(),
      courseId: 1,
    });

    expect(result.success).toBe(true);
  });

  it("should fail if description exceeds max length", () => {
    const result = createTaskDto.safeParse({
      title: "Tugas Biologi",
      description: "a".repeat(256),
      deadline: new Date(),
      courseId: 1,
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Deskripsi harus maksimal 255 karakter",
      );
    }
  });

  // deadline validation
  it("should fail if deadline is missing", () => {
    const result = createTaskDto.safeParse({
      title: "Tugas Sejarah",
      courseId: 1,
    });

    expect(result.success).toBe(false);
  });

  it("should fail if deadline is not a date", () => {
    const result = createTaskDto.safeParse({
      title: "Tugas Sejarah",
      deadline: "2023-01-01",
      courseId: 1,
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Format tanggal tidak valid");
    }
  });

  // courseId validation
  it("should fail if courseId is missing", () => {
    const result = createTaskDto.safeParse({
      title: "Tugas Sosiologi",
      deadline: new Date(),
    });

    expect(result.success).toBe(false);
  });

  it("should fail if courseId is not a number", () => {
    const result = createTaskDto.safeParse({
      title: "Tugas Sosiologi",
      deadline: new Date(),
      courseId: "1",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Format ID kursus tidak valid",
      );
    }
  });
});
