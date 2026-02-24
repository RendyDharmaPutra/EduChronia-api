import { describe, expect, it, mock, beforeEach } from "bun:test";
import { CourseController } from "./course.controller";
import type { CourseService } from "./course.service";
import { response } from "../../common/http/response";

// Mock dependencies
const mockService = {
  getAllCourse: mock(),
  createCourse: mock(),
  getCourseById: mock(),
  updateCourseById: mock(),
  deleteCourseById: mock(),
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
mock.module("../../common/http/response", () => ({
  response: {
    success: mock((c: any, data: any, meta?: any) =>
      c.json({ success: true, data, meta }, 200),
    ),
    fail: mock(),
  },
}));

// Mock safeParseParams
mock.module("../../common/http/validation/safe-parse-params", () => ({
  safeParseParams: mock(),
}));

// Mock safeParseBody
mock.module("../../common/http/validation/safe-parse-body", () => ({
  safeParseBody: mock(),
}));

describe("CourseController", () => {
  const controller = new CourseController(
    mockService as unknown as CourseService,
  );

  beforeEach(() => {
    Object.values(mockService).forEach((m) => (m as any).mockReset());
    mockContext.get.mockReset();
    mockContext.json.mockReset();
  });

  describe("list", () => {
    it("should return success response with data and pagination", async () => {
      const mockUserId = "user-123";
      const mockData = [{ id: 1, name: "Course 1" }];
      const mockPagination = { page: 1, limit: 10, total: 1 };

      mockContext.get.mockReturnValue(mockUserId);
      (mockService.getAllCourse as any).mockResolvedValue({
        data: mockData,
        pagination: mockPagination,
      });

      await controller.list(mockContext);

      expect(mockContext.get).toHaveBeenCalledWith("userId");
      expect(mockService.getAllCourse).toHaveBeenCalledWith(mockUserId, 1, 10);
      expect(response.success).toHaveBeenCalledWith(mockContext, mockData, {
        pagination: mockPagination,
      });
    });
  });

  describe("get", () => {
    it("should return course detail successfully", async () => {
      const mockUserId = "user-123";
      const mockCourseId = 1;
      const mockCourse = { id: mockCourseId, name: "Test Course" };

      mockContext.get.mockReturnValue(mockUserId);
      const { safeParseParams } =
        await import("../../common/http/validation/safe-parse-params");
      (safeParseParams as any).mockReturnValue({ id: mockCourseId });

      mockService.getCourseById.mockResolvedValue(mockCourse);

      await controller.get(mockContext);

      expect(mockContext.get).toHaveBeenCalledWith("userId");
      expect(mockService.getCourseById).toHaveBeenCalledWith(
        mockCourseId,
        mockUserId,
      );
      expect(response.success).toHaveBeenCalledWith(mockContext, mockCourse);
    });
  });

  describe("create", () => {
    it("should create a course successfully", async () => {
      const mockUserId = "user-1";
      const mockBody = { name: "Test Course", description: "Test Description" };
      const createdCourse = { ...mockBody, id: 1, userId: mockUserId };

      mockContext.get.mockReturnValue(mockUserId);
      const { safeParseBody } =
        await import("../../common/http/validation/safe-parse-body");
      (safeParseBody as any).mockResolvedValue(mockBody);
      mockService.createCourse.mockResolvedValue(createdCourse);

      await controller.create(mockContext);

      expect(mockService.createCourse).toHaveBeenCalledWith({
        ...mockBody,
        userId: mockUserId,
      });
      expect(response.success).toHaveBeenCalledWith(mockContext, createdCourse);
    });
  });

  describe("update", () => {
    it("should update a course successfully", async () => {
      const mockUserId = "user-1";
      const mockCourseId = 1;
      const mockBody = { name: "Updated Course", description: "Updated Desc" };
      const updatedCourse = {
        ...mockBody,
        id: mockCourseId,
        userId: mockUserId,
      };

      mockContext.get.mockReturnValue(mockUserId);
      const { safeParseParams } =
        await import("../../common/http/validation/safe-parse-params");
      const { safeParseBody } =
        await import("../../common/http/validation/safe-parse-body");
      (safeParseParams as any).mockReturnValue({ id: mockCourseId });
      (safeParseBody as any).mockResolvedValue(mockBody);
      mockService.updateCourseById.mockResolvedValue(updatedCourse);

      await controller.update(mockContext);

      expect(mockService.updateCourseById).toHaveBeenCalledWith(
        mockCourseId,
        { ...mockBody, userId: mockUserId },
        mockUserId,
      );
      expect(response.success).toHaveBeenCalledWith(mockContext, updatedCourse);
    });
  });

  describe("delete", () => {
    it("should delete a course successfully", async () => {
      const mockUserId = "user-1";
      const mockCourseId = 1;

      mockContext.get.mockReturnValue(mockUserId);
      const { safeParseParams } =
        await import("../../common/http/validation/safe-parse-params");
      (safeParseParams as any).mockReturnValue({ id: mockCourseId });
      mockService.deleteCourseById.mockResolvedValue(1);

      await controller.delete(mockContext);

      expect(mockService.deleteCourseById).toHaveBeenCalledWith(
        mockCourseId,
        mockUserId,
      );
      expect(response.success).toHaveBeenCalledWith(mockContext);
    });
  });
});
