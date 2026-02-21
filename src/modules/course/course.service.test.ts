import { describe, expect, it, mock } from "bun:test";
import { CourseService } from "./course.service";
import { AppException } from "../../common/http/exception/base.exception";

describe("CourseService", () => {
  // Mock repository dependencies
  const mockRepository = {
    findAllByUser: mock(),
    create: mock(),
    findById: mock(),
    countByUser: mock(),
  };

  const service = new CourseService(mockRepository);

  describe("getAllCourse", () => {
    it("should return data and meta on success", async () => {
      const mockUserId = "user-123";
      const mockPage = 1;
      const mockLimit = 10;
      const mockCourses = [{ id: 1, name: "Course 1", description: "Desc 1" }];

      (mockRepository.findAllByUser as any).mockResolvedValue(mockCourses);
      (mockRepository.countByUser as any).mockResolvedValue([{ count: 1 }]);

      const result = await service.getAllCourse(
        mockUserId,
        mockPage,
        mockLimit,
      );

      expect(mockRepository.findAllByUser).toHaveBeenCalledWith(
        mockUserId,
        mockPage,
        mockLimit,
      );
      expect(result).toEqual({
        data: mockCourses,
        meta: {
          page: mockPage,
          limit: mockLimit,
          total: mockCourses.length,
        },
      });
    });

    it("should throw an error if repository fails", async () => {
      const mockUserId = "user-123";
      const mockError = new Error("DB Error");

      (mockRepository.findAllByUser as any).mockRejectedValue({
        cause: mockError.message,
      });

      expect(service.getAllCourse(mockUserId, 1, 10)).rejects.toThrow(
        "DB Error",
      );
    });
  });

  describe("getCourseById", () => {
    it("should return course detail successfully", async () => {
      const mockCourse = { id: 1, name: "Course 1", description: "Desc 1" };
      const mockUserId = "user-123";

      (mockRepository.findById as any).mockResolvedValue(mockCourse);

      const result = await service.getCourseById(1, mockUserId);

      expect(mockRepository.findById).toHaveBeenCalledWith(1, mockUserId);
      expect(result).toEqual(mockCourse);
    });

    it("should throw AppException if course not found", async () => {
      const mockUserId = "user-123";
      (mockRepository.findById as any).mockResolvedValue(null);

      try {
        await service.getCourseById(1, mockUserId);
      } catch (error: any) {
        expect(error).toBeInstanceOf(AppException);
        expect(error.message).toBe("Kursus tidak ditemukan");
        expect(error.statusCode).toBe(404);
      }
    });

    it("should throw Error if repository fails", async () => {
      const mockUserId = "user-123";
      const mockError = new Error("DB Error");

      (mockRepository.findById as any).mockRejectedValue({
        cause: mockError.message,
      });

      // service.getCourseById rethrows error.cause as new Error if not AppException
      await expect(service.getCourseById(1, mockUserId)).rejects.toThrow(
        "DB Error",
      );
    });
  });

  describe("createCourse", () => {
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
});
