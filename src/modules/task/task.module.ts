import { TaskRepository } from "./task.repository";

const repository = new TaskRepository();

export const TaskModule = {
  repository,
};