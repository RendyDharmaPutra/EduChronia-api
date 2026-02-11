import { describe, expect, it, mock } from "bun:test";
import { CourseRepository } from "./course.repository";
import { db } from "../../common/db/client";
import { coursesTable } from "../../common/db/schema/course.schema";

// Mock database client
mock.module("../../common/db/client", () => ({
  db: {
    select: mock(),
    insert: mock(() => ({
      values: mock(() => ({
        returning: mock(() => Promise.resolve([mockCourse])),
      })),
    })),
  },
}));

const mockCourse = {
  id: "1",
  name: "Test Course",
  description: "Test Description",
  userId: "user-1",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("CourseRepository", () => {
  const repository = new CourseRepository();

  describe("findAllByUser", () => {
    it("should return a list of courses for a given user", async () => {
      const mockUserId = "user-123";
      const mockPage = 1;
      const mockLimit = 10;
      const mockCourses = [
        { id: 1, name: "Course 1", description: "Desc 1" },
        { id: 2, name: "Course 2", description: "Desc 2" },
      ];

      // Setup mock chain
      const offsetMock = mock().mockResolvedValue(mockCourses);
      const limitMock = mock().mockReturnValue({ offset: offsetMock });
      const whereMock = mock().mockReturnValue({ limit: limitMock });
      const fromMock = mock().mockReturnValue({ where: whereMock });

      (db.select as any).mockReturnValue({ from: fromMock });

      const result = await repository.findAllByUser(
        mockUserId,
        mockPage,
        mockLimit,
      );

      expect(db.select).toHaveBeenCalled();
      expect(fromMock).toHaveBeenCalled();
      expect(whereMock).toHaveBeenCalled();
      expect(limitMock).toHaveBeenCalledWith(mockLimit);
      expect(offsetMock).toHaveBeenCalledWith(0);
      expect(result).toEqual(mockCourses);
    });
  });

  describe("create", () => {
    it("should create a course", async () => {
      const newCourse = {
        name: "Test Course",
        description: "Test Description",
        userId: "user-1",
      };

      const result = await repository.create(newCourse);

      expect(result).toEqual(mockCourse);
      expect(db.insert).toHaveBeenCalledWith(coursesTable);
    });
  });
});
