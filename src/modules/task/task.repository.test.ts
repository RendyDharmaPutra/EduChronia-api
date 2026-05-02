import { describe, expect, it, mock, beforeEach } from "bun:test";
import { tasksTable } from "../../common/db/schema/task.schema";
import { eq } from "drizzle-orm";

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
  insert: mock(),
  update: mock(),
  delete: mock(),
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
    mockDb.insert.mockReset();
    mockDb.update.mockReset();
    mockDb.delete.mockReset();

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
  });

  describe("create", () => {
    it("should insert a new task and return it", async () => {
      const newTask = { title: "New", courseId: 1 };
      const returningMock = mock().mockResolvedValue([{ ...newTask, id: 1 }]);
      const valuesMock = mock().mockReturnValue({ returning: returningMock });

      mockDb.insert.mockReturnValue({ values: valuesMock });

      const result = await repository.create(newTask as any);

      expect(mockDb.insert).toHaveBeenCalledWith(tasksTable);
      expect(valuesMock).toHaveBeenCalledWith(newTask);
      expect(returningMock).toHaveBeenCalled();
      expect(result).toEqual({ ...newTask, id: 1 });
    });
  });

  describe("updateById", () => {
    it("should update task and return updated data", async () => {
      const updateData = { title: "Updated" };
      const returningMock = mock().mockResolvedValue([{ id: 1, ...updateData }]);
      const whereMock = mock().mockReturnValue({ returning: returningMock });
      const setMock = mock().mockReturnValue({ where: whereMock });

      mockDb.update.mockReturnValue({ set: setMock });

      const result = await repository.updateById(1, updateData);

      expect(mockDb.update).toHaveBeenCalledWith(tasksTable);
      expect(setMock).toHaveBeenCalledWith(updateData);
      expect(whereMock).toHaveBeenCalled();
      expect(result).toEqual({ id: 1, ...updateData });
    });
  });

  describe("deleteById", () => {
    it("should delete task and return row count", async () => {
      const whereMock = mock().mockResolvedValue({ rowCount: 1 });
      mockDb.delete.mockReturnValue({ where: whereMock });

      const result = await repository.deleteById(1);

      expect(mockDb.delete).toHaveBeenCalledWith(tasksTable);
      expect(whereMock).toHaveBeenCalled();
      expect(result).toBe(1);
    });
  });
});
