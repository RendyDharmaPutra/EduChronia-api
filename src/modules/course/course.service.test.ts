import { describe, it, expect, mock, beforeEach } from "bun:test";
import { CourseService } from "./course.service";
import { CourseRepository } from "./course.repository";
import { AppException } from "../../common/http/exception/base.exception";

const mockRepository = {
  create: mock(),
};

describe("CourseService", () => {
  let service: CourseService;

  beforeEach(() => {
    service = new CourseService(mockRepository as unknown as CourseRepository);
    mockRepository.create.mockClear();
  });

  it("should create a course successfully", async () => {
    const course = {
      name: "Test Course",
      description: "Test Description",
      userId: "user-1",
    };
    const createdCourse = { ...course, id: "1", createdAt: new Date() };

    mockRepository.create.mockResolvedValue(createdCourse);

    const result = await service.createCourse(course);

    expect(result).toEqual(createdCourse);
    expect(mockRepository.create).toHaveBeenCalledWith(course);
  });

  it("should throw AppException on duplicate course", async () => {
    const course = {
      name: "Duplicate Course",
      description: "Test Description",
      userId: "user-1",
    };

    const duplicateError = new Error("Duplicate");
    // @ts-ignore
    duplicateError.cause = { code: "23505" };

    mockRepository.create.mockRejectedValue(duplicateError);

    try {
      await service.createCourse(course);
    } catch (error: any) {
      expect(error).toBeInstanceOf(AppException);
      expect(error.message).toBe(
        "Kursus dengan nama Duplicate Course sudah ada",
      );
      expect(error.statusCode).toBe(409);
    }
  });

  it("should throw Error on other errors", async () => {
    const course = {
      name: "Test Course",
      description: "Test Description",
      userId: "user-1",
    };

    const unknownError = new Error("Unknown error");
    // @ts-ignore
    unknownError.cause = "Some unknown error";

    mockRepository.create.mockRejectedValue(unknownError);

    try {
      await service.createCourse(course);
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Some unknown error");
    }
  });
});
