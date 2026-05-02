import { describe, expect, it, mock, beforeEach } from "bun:test";
import { TaskController } from "./task.controller";
import type { TaskService } from "./task.service";
import { response } from "../../common/http/response";

// Mock dependencies
const mockService = {
  createTask: mock(),
  updateTaskById: mock(),
  deleteTaskById: mock(),
  setCompleteById: mock(),
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

// Mock Response module
mock.module("../../common/http/response", () => ({
  response: {
    success: mock((c: any, data?: any) => c.json({ success: true, data }, 200)),
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

describe("TaskController", () => {
  const controller = new TaskController(mockService as unknown as TaskService);

  beforeEach(() => {
    Object.values(mockService).forEach((m) => (m as any).mockReset());
    mockContext.get.mockReset();
    mockContext.json.mockReset();
  });

  describe("create", () => {
    it("should create a task successfully", async () => {
      const mockUserId = "user-1";
      const mockBody = { title: "Test Task" };
      const createdTask = { ...mockBody, userId: mockUserId, id: 1 };

      mockContext.get.mockReturnValue(mockUserId);
      const { safeParseBody } = await import("../../common/http/validation/safe-parse-body");
      (safeParseBody as any).mockResolvedValue(mockBody);
      mockService.createTask.mockResolvedValue(createdTask);

      await controller.create(mockContext);

      expect(mockService.createTask).toHaveBeenCalledWith({ ...mockBody, userId: mockUserId });
      expect(response.success).toHaveBeenCalledWith(mockContext, createdTask);
    });
  });

  describe("update", () => {
    it("should update a task successfully", async () => {
      const mockUserId = "user-1";
      const mockTaskId = 1;
      const mockBody = { title: "Updated Task" };
      const updatedTask = { ...mockBody, id: mockTaskId, userId: mockUserId };

      mockContext.get.mockReturnValue(mockUserId);
      const { safeParseParams } = await import("../../common/http/validation/safe-parse-params");
      const { safeParseBody } = await import("../../common/http/validation/safe-parse-body");
      (safeParseParams as any).mockReturnValue({ id: mockTaskId });
      (safeParseBody as any).mockResolvedValue(mockBody);
      mockService.updateTaskById.mockResolvedValue(updatedTask);

      await controller.update(mockContext);

      expect(mockService.updateTaskById).toHaveBeenCalledWith(mockTaskId, { ...mockBody, userId: mockUserId });
      expect(response.success).toHaveBeenCalledWith(mockContext, updatedTask);
    });
  });

  describe("delete", () => {
    it("should delete a task successfully", async () => {
      const mockTaskId = 1;

      const { safeParseParams } = await import("../../common/http/validation/safe-parse-params");
      (safeParseParams as any).mockReturnValue({ id: mockTaskId });
      mockService.deleteTaskById.mockResolvedValue(1);

      await controller.delete(mockContext);

      expect(mockService.deleteTaskById).toHaveBeenCalledWith(mockTaskId);
      expect(response.success).toHaveBeenCalledWith(mockContext);
    });
  });

  describe("setComplete", () => {
    it("should mark task as completed", async () => {
      const mockTaskId = 1;
      const updatedTask = { id: mockTaskId, isCompleted: true };

      const { safeParseParams } = await import("../../common/http/validation/safe-parse-params");
      (safeParseParams as any).mockReturnValue({ id: mockTaskId });
      mockService.setCompleteById.mockResolvedValue(updatedTask);

      await controller.setComplete(mockContext);

      expect(mockService.setCompleteById).toHaveBeenCalledWith(mockTaskId, true);
      expect(response.success).toHaveBeenCalledWith(mockContext, updatedTask);
    });
  });

  describe("setUnComplete", () => {
    it("should mark task as uncompleted", async () => {
      const mockTaskId = 1;
      const updatedTask = { id: mockTaskId, isCompleted: false };

      const { safeParseParams } = await import("../../common/http/validation/safe-parse-params");
      (safeParseParams as any).mockReturnValue({ id: mockTaskId });
      mockService.setCompleteById.mockResolvedValue(updatedTask);

      await controller.setUnComplete(mockContext);

      expect(mockService.setCompleteById).toHaveBeenCalledWith(mockTaskId, false);
      expect(response.success).toHaveBeenCalledWith(mockContext, updatedTask);
    });
  });
});
