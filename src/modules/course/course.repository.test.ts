import { describe, expect, it, mock, beforeEach } from "bun:test";
import { coursesTable } from "../../common/db/schema/course.schema";

const mockCourse = {
  id: "1",
  name: "Test Course",
  description: "Test Description",
  userId: "user-1",
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Mock database client
const mockDb = {
  select: mock(),
  insert: mock(),
};

mock.module("../../common/db/client", () => ({
  db: mockDb,
}));

describe("CourseRepository", () => {
  let CourseRepository: any;
  let repository: any;

  beforeEach(async () => {
    mockDb.select.mockReset();
    mockDb.insert.mockReset();

    // Re-import to ensure fresh module state if needed, though for classes usually once is enough
    // But safely, let's just import once if we can, or usually import in beforeAll
    const mod = await import("./course.repository");
    CourseRepository = mod.CourseRepository;
    repository = new CourseRepository();
  });

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
      const orderByMock = mock().mockReturnValue({ limit: limitMock });
      const whereMock = mock().mockReturnValue({ orderBy: orderByMock });
      const fromMock = mock().mockReturnValue({ where: whereMock });

      mockDb.select.mockReturnValue({ from: fromMock });

      const result = await repository.findAllByUser(
        mockUserId,
        mockPage,
        mockLimit,
      );

      expect(mockDb.select).toHaveBeenCalled();
      expect(fromMock).toHaveBeenCalled();
      expect(whereMock).toHaveBeenCalled();
      expect(orderByMock).toHaveBeenCalled();
      expect(limitMock).toHaveBeenCalledWith(mockLimit);
      expect(offsetMock).toHaveBeenCalledWith(0);
      expect(result).toEqual(mockCourses);
    });
  });

  describe("findById", () => {
    it("should return course data if found", async () => {
      const mockId = 1;
      const mockUserId = "user-123";

      const whereMock = mock().mockResolvedValue([mockCourse]);
      const fromMock = mock().mockReturnValue({ where: whereMock });

      mockDb.select.mockReturnValue({ from: fromMock });

      const result = await repository.findById(mockId, mockUserId);

      expect(mockDb.select).toHaveBeenCalled();
      expect(fromMock).toHaveBeenCalledWith(coursesTable);
      expect(whereMock).toHaveBeenCalled();
      expect(result).toEqual(mockCourse);
    });

    it("should return null if course not found", async () => {
      const mockId = 999;
      const mockUserId = "user-123";

      const whereMock = mock().mockResolvedValue([]);
      const fromMock = mock().mockReturnValue({ where: whereMock });

      mockDb.select.mockReturnValue({ from: fromMock });

      const result = await repository.findById(mockId, mockUserId);

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should create a course", async () => {
      const newCourse = {
        name: "Test Course",
        description: "Test Description",
        userId: "user-1",
      };

      const valuesMock = mock().mockReturnValue({
        returning: mock().mockResolvedValue([mockCourse]),
      });

      mockDb.insert.mockReturnValue({ values: valuesMock });

      const result = await repository.create(newCourse);

      expect(result).toEqual(mockCourse);
      expect(mockDb.insert).toHaveBeenCalledWith(coursesTable);
      expect(valuesMock).toHaveBeenCalledWith(newCourse);
    });
  });
});
