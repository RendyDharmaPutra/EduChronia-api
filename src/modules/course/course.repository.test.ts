import { describe, it, expect, mock, beforeEach } from "bun:test";
import { CourseRepository } from "./course.repository";
import { db } from "../../common/db/client";
import { coursesTable } from "../../common/db/schema/course.schema";

// Mock the db client
mock.module("../../common/db/client", () => ({
  db: {
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
  let repository: CourseRepository;

  beforeEach(() => {
    repository = new CourseRepository();
  });

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
