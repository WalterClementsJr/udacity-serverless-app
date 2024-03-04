import { TodoItem } from "../models/TodoItem";
import { parseUserId } from "../auth/utils";
import {CreateTodoDto} from "../models/CreateToDoDto";
import {UpdateTodoDto} from "../models/UpdateToDoDto";
import {ToDoRepository} from "../repositories/ToDoRepository";
import {TodoItemUpdate} from "../models/ToDoItemUpdate";

const uuidv4 = require("uuid/v4");
const toDoAccess = new ToDoRepository();

export async function getAllToDo(jwtToken: string): Promise<TodoItem[]> {
  const userId = parseUserId(jwtToken);
  return toDoAccess.getAllToDo(userId);
}

export function createToDo(
  createTodoRequest: CreateTodoDto,
  jwtToken: string
): Promise<TodoItem> {
  const userId = parseUserId(jwtToken);
  const todoId = uuidv4();

  return toDoAccess.createToDo({
    userId: userId,
    todoId: todoId,
    attachmentUrl: "",
    createdAt: new Date().getTime().toString(),
    done: false,
    ...createTodoRequest,
  });
}

export function updateToDo(
  updateTodoRequest: UpdateTodoDto,
  todoId: string,
  jwtToken: string
): Promise<TodoItemUpdate> {
  const userId = parseUserId(jwtToken);
  return toDoAccess.updateToDo(updateTodoRequest, todoId, userId);
}

export function deleteToDo(todoId: string, jwtToken: string): Promise<string> {
  const userId = parseUserId(jwtToken);
  return toDoAccess.deleteToDo(todoId, userId);
}

export function generateUploadUrl(todoId: string): Promise<string> {
  return toDoAccess.generateUploadUrl(todoId);
}
