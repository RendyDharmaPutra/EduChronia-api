import { describe, it, expect } from "bun:test";
import { createCourseDto } from "./dto/course.dto";

describe("CreateCourseDto", () => {
  it("should pass with valid data", () => {
    const result = createCourseDto.safeParse({
      name: "Matematika Dasar",
      description: "Kursus pengantar matematika",
    });

    expect(result.success).toBe(true);
  });

  // name validation
  it("should fail if name is too short", () => {
    const result = createCourseDto.safeParse({
      name: "AB",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Nama Kursus harus minimal 3 karakter",
      );
    }
  });

  it("should fail if name is empty after trim", () => {
    const result = createCourseDto.safeParse({
      name: "         ",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Nama Kursus harus diisi");
    }
  });

  // description validation
  it("should pass without description", () => {
    const result = createCourseDto.safeParse({
      name: "Fisika",
    });

    expect(result.success).toBe(true);
  });

  it("should fail if description exceeds max length", () => {
    const result = createCourseDto.safeParse({
      name: "Biologi",
      description: "a".repeat(256),
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Deskripsi harus maksimal 255 karakter",
      );
    }
  });
});
