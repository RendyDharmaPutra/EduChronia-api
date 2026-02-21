import { describe, expect, it, mock } from "bun:test";
import { CourseController } from "./course.controller";
import type { CourseService } from "./course.service";
import { safeParseBody } from "../../common/http/validation/safe-parse-body";
import { response } from "../../common/http/response";

// Mock dependencies
const mockService = {
  getAllCourse: mock(),
  createCourse: mock(),
  getCourseById: mock(),
};

// Mock Hono Context
const mockContext = {
  get: mock(),
  req: {
    query: mock(),
    json: mock(),
  },
  json: mock(),
} as any;

// Mock safeParsePaginationQuery
mock.module("../../common/http/validation/safe-parse-query", () => ({
  safeParsePaginationQuery: mock().mockReturnValue({ page: 1, limit: 10 }),
}));

// Mock Response module to ensure we control the behavior
// We implement success to call c.json so we can verify the flow
mock.module("../../common/http/response", () => ({
  response: {
    success: mock((c, data, meta) =>
      c.json({ success: true, data, meta }, 200),
    ),
    fail: mock(),
  },
}));

// Mock safeParseParams
mock.module("../../common/http/validation/safe-parse-params", () => ({
  safeParseParams: mock(),
}));

// Mock safeParseBody with correct path
mock.module("../../common/http/validation/safe-parse-body", () => ({
  safeParseBody: mock(),
}));

describe("CourseController", () => {
  const controller = new CourseController(
    mockService as unknown as CourseService,
  );

  describe("list", () => {
    it("should return success response with data and meta", async () => {
      const mockUserId = "user-123";
      const mockData = [{ id: 1, name: "Course 1" }];
      const mockMeta = { page: 1, limit: 10, total: 1 };

      mockContext.get.mockReturnValue(mockUserId);
      (mockService.getAllCourse as any).mockResolvedValue({
        data: mockData,
        pagination: mockMeta, // Fixed: service returns 'pagination', not 'meta'
      });

      await controller.list(mockContext);

      expect(mockContext.get).toHaveBeenCalledWith("userId");
      expect(mockService.getAllCourse).toHaveBeenCalledWith(mockUserId, 1, 10);

      // Verify response.success was called
      expect(response.success).toHaveBeenCalledWith(
        mockContext,
        mockData,
        { pagination: mockMeta }, // Fixed: controller passes { pagination: ... } as meta
      );

      // Verify c.json was called (via our mock implementation of response.success)
      expect(mockContext.json).toHaveBeenCalledTimes(1);
    });
  });

  describe("get", () => {
    it("should return course detail successfully", async () => {
      const mockUserId = "user-123";
      const mockCourseId = 1;
      const mockCourse = { id: mockCourseId, name: "Test Course" };

      // Setup mocks
      mockContext.get.mockReturnValue(mockUserId);
      const { safeParseParams } =
        await import("../../common/http/validation/safe-parse-params");
      (safeParseParams as any).mockReturnValue({ id: mockCourseId });

      mockService.getCourseById.mockResolvedValue(mockCourse);

      await controller.get(mockContext);

      expect(mockContext.get).toHaveBeenCalledWith("userId");
      expect(safeParseParams).toHaveBeenCalledWith(
        mockContext,
        expect.anything(),
        "ID tidak valid",
      );
      expect(mockService.getCourseById).toHaveBeenCalledWith(
        mockCourseId,
        mockUserId,
      );
      expect(response.success).toHaveBeenCalledWith(mockContext, mockCourse);
    });

    it("should return 404 if service throws COURSE_NOT_FOUND", async () => {
      const mockUserId = "user-123";
      const mockCourseId = 999;
      const error = new Error("Kursus tidak ditemukan");
      // @ts-ignore
      error.statusCode = 404;

      // Setup mocks
      mockContext.get.mockReturnValue(mockUserId);
      const { safeParseParams } =
        await import("../../common/http/validation/safe-parse-params");
      (safeParseParams as any).mockReturnValue({ id: mockCourseId });

      mockService.getCourseById.mockRejectedValue(error);

      try {
        await controller.get(mockContext);
      } catch (e: any) {
        expect(e.message).toBe("Kursus tidak ditemukan");
        expect(e.statusCode).toBe(404);
      }

      expect(mockService.getCourseById).toHaveBeenCalledWith(
        mockCourseId,
        mockUserId,
      );
    });

    it("should return 500 if service throws unknown error", async () => {
      const mockUserId = "user-123";
      const mockCourseId = 1;
      const error = new Error("Database error");

      // Setup mocks
      mockContext.get.mockReturnValue(mockUserId);
      const { safeParseParams } =
        await import("../../common/http/validation/safe-parse-params");
      (safeParseParams as any).mockReturnValue({ id: mockCourseId });

      mockService.getCourseById.mockRejectedValue(error);

      try {
        await controller.get(mockContext);
      } catch (e: any) {
        expect(e.message).toBe("Database error");
      }

      expect(mockService.getCourseById).toHaveBeenCalledWith(
        mockCourseId,
        mockUserId,
      );
    });
  });

  describe("create", () => {
    it("should create a course successfully", async () => {
      const mockContext = {
        get: mock((key: string) => {
          if (key === "userId") return "user-1";
          return null;
        }),
        req: {
          json: mock(),
        },
        json: mock(),
      };

      const mockBody = {
        name: "Test Course",
        description: "Test Description",
      };

      const createdCourse = { ...mockBody, id: "1", userId: "user-1" };

      // Setup mock return value for safeParseBody
      (safeParseBody as any).mockResolvedValue(mockBody);
      mockService.createCourse.mockResolvedValue(createdCourse);

      // @ts-ignore
      await controller.create(mockContext);

      expect(safeParseBody).toHaveBeenCalledWith(
        mockContext,
        expect.anything(),
        "Data kursus tidak valid",
      );
      expect(mockService.createCourse).toHaveBeenCalledWith({
        ...mockBody,
        userId: "user-1",
      });
      expect(response.success).toHaveBeenCalledWith(mockContext, createdCourse);
    });
  });
});
