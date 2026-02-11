import { describe, it, expect, mock, beforeEach } from "bun:test";
import { CourseController } from "./course.controller";
import { CourseService } from "./course.service";
import { response } from "../../common/http/response";
import { safeParseBody } from "../../common/http/safe-parse-body";

// Mock Service
const mockService = {
  createCourse: mock(),
};

// Mock Response
// We need to spy on response.success to verify it's called
mock.module("../../common/http/response", () => ({
  response: {
    success: mock(() => ({ status: 200, body: "success" })),
    fail: mock(() => ({ status: 500, body: "fail" })),
  },
}));

// Mock safeParseBody
mock.module("../../common/http/safe-parse-body", () => ({
  safeParseBody: mock(),
}));

describe("CourseController", () => {
  let controller: CourseController;

  beforeEach(() => {
    controller = new CourseController(mockService as unknown as CourseService);
    mockService.createCourse.mockClear();
  });

  it("should create a course successfully", async () => {
    const mockContext = {
      get: mock((key: string) => {
        if (key === "userId") return "user-1";
        return null;
      }),
      req: {
        json: mock(),
      },
    };

    const mockBody = {
      name: "Test Course",
      description: "Test Description",
    };

    const createdCourse = { ...mockBody, id: "1", userId: "user-1" };

    (safeParseBody as unknown as jest.Mock).mockResolvedValue(mockBody);
    mockService.createCourse.mockResolvedValue(createdCourse);

    // @ts-ignore
    const result = await controller.create(mockContext);

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
