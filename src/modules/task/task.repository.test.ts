import { describe, expect, it, mock, beforeEach } from "bun:test";
import { tasksTable } from "../../common/db/schema/task.schema";

const mockTask = {
  id: 1,
  title: "Test Task",
  description: "Test Description",
  deadline: new Date(),
  isCompleted: false,
  courseId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Mock database client
const mockDb = {
  select: mock(),
};

mock.module("../../common/db/client", () => ({
  db: mockDb,
}));

// Mock logger
mock.module("../../common/lib/logger/pino", () => ({
  logger: {
    trace: mock(),
  },
}));

describe("TaskRepository", () => {
  let TaskRepository: any;
  let repository: any;

  beforeEach(async () => {
    mockDb.select.mockReset();

    const mod = await import("./task.repository");
    TaskRepository = mod.TaskRepository;
    repository = new TaskRepository();
  });

  describe("findByCourseId", () => {
    it("should return a list of tasks for a given course id", async () => {
      const mockCourseId = 1;
      const mockTasks = [mockTask];

      const orderByMock = mock().mockResolvedValue(mockTasks);
      const whereMock = mock().mockReturnValue({ orderBy: orderByMock });
      const fromMock = mock().mockReturnValue({ where: whereMock });

      mockDb.select.mockReturnValue({ from: fromMock });

      const result = await repository.findByCourseId(mockCourseId);

      expect(mockDb.select).toHaveBeenCalled();
      expect(fromMock).toHaveBeenCalledWith(tasksTable);
      expect(whereMock).toHaveBeenCalled();
      expect(result).toEqual(mockTasks);
    });

    it("should return empty array if no tasks found", async () => {
      const mockCourseId = 999;

      const orderByMock = mock().mockResolvedValue([]);
      const whereMock = mock().mockReturnValue({ orderBy: orderByMock });
      const fromMock = mock().mockReturnValue({ where: whereMock });

      mockDb.select.mockReturnValue({ from: fromMock });

      const result = await repository.findByCourseId(mockCourseId);

      expect(mockDb.select).toHaveBeenCalled();
      expect(fromMock).toHaveBeenCalledWith(tasksTable);
      expect(whereMock).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});
