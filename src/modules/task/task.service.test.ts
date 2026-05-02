import { describe, expect, it, mock, beforeEach } from "bun:test";
import { TaskService } from "./task.service";
import { AppException } from "../../common/http/exception/base.exception";

// Mock logger
mock.module("../../common/lib/logger/pino", () => ({
  logger: {
    trace: mock(),
    debug: mock(),
  },
}));

describe("TaskService", () => {
  const mockRepository = {
    findByCourseId: mock(),
    create: mock(),
    updateById: mock(),
    deleteById: mock(),
  };

  const service = new TaskService(mockRepository as any);

  beforeEach(() => {
    Object.values(mockRepository).forEach((m) => (m as any).mockReset());
  });

  describe("createTask", () => {
    it("should create a task successfully", async () => {
      const mockTaskData = {
        title: "Test Task",
        courseId: 1,
        userId: "user-1",
        deadline: new Date(),
      };
      const createdTask = { ...mockTaskData, id: 1 };

      mockRepository.create.mockResolvedValue(createdTask);

      const result = await service.createTask(mockTaskData as any);

      expect(mockRepository.create).toHaveBeenCalledWith(mockTaskData);
      expect(result).toEqual(createdTask);
    });

    it("should handle error properly", async () => {
      const mockErrorMessage = "DB Error";
      mockRepository.create.mockRejectedValue(new Error(mockErrorMessage));

      await expect(service.createTask({} as any)).rejects.toThrow(mockErrorMessage);
    });
  });

  describe("updateTaskById", () => {
    it("should update task successfully", async () => {
      const updatedTask = { id: 1, title: "Updated" };
      mockRepository.updateById.mockResolvedValue(updatedTask);

      const result = await service.updateTaskById(1, { title: "Updated" });

      expect(mockRepository.updateById).toHaveBeenCalledWith(1, { title: "Updated" });
      expect(result).toEqual(updatedTask);
    });

    it("should throw AppException if task not found", async () => {
      mockRepository.updateById.mockResolvedValue(undefined);

      try {
        await service.updateTaskById(1, { title: "Updated" });
      } catch (error: any) {
        expect(error).toBeInstanceOf(AppException);
        expect(error.message).toBe("Task tidak ditemukan");
        expect(error.statusCode).toBe(404);
      }
    });
  });

  describe("deleteTaskById", () => {
    it("should delete task successfully", async () => {
      mockRepository.deleteById.mockResolvedValue(1);

      const result = await service.deleteTaskById(1);

      expect(mockRepository.deleteById).toHaveBeenCalledWith(1);
      expect(result).toBe(1);
    });

    it("should throw AppException if task not found", async () => {
      mockRepository.deleteById.mockResolvedValue(0);

      try {
        await service.deleteTaskById(1);
      } catch (error: any) {
        expect(error).toBeInstanceOf(AppException);
        expect(error.message).toBe("Tugas tidak ditemukan");
        expect(error.statusCode).toBe(404);
      }
    });
  });

  describe("setCompleteById", () => {
    it("should update task completion status", async () => {
      const updatedTask = { id: 1, isCompleted: true };
      mockRepository.updateById.mockResolvedValue(updatedTask);

      const result = await service.setCompleteById(1, true);

      expect(mockRepository.updateById).toHaveBeenCalledWith(1, { isCompleted: true });
      expect(result).toEqual(updatedTask);
    });

    it("should throw AppException if task not found", async () => {
      mockRepository.updateById.mockResolvedValue(undefined);

      try {
        await service.setCompleteById(1, true);
      } catch (error: any) {
        expect(error).toBeInstanceOf(AppException);
        expect(error.message).toBe("Tugas tidak ditemukan");
        expect(error.statusCode).toBe(404);
      }
    });
  });
});
