import { TodoItem } from "../models/TodoItem";
import { parseUserId } from "../auth/utils";
import {CreateTodoDto} from "../models/CreateToDoDto";
import {UpdateTodoDto} from "../models/UpdateToDoDto";
import {ToDoRepository} from "../repositories/ToDoRepository";
import {TodoItemUpdate} from "../models/ToDoItemUpdate";
import {v4 as uuidv4} from 'uuid';

const toDoRepository = new ToDoRepository();

export async function getAllToDo(jwtToken: string): Promise<TodoItem[]> {
  const userId = parseUserId(jwtToken);
  return toDoRepository.getAllToDo(userId);
}

export function createToDo(
  createTodoRequest: CreateTodoDto,
  jwtToken: string
): Promise<TodoItem> {
  const userId = parseUserId(jwtToken);
  const todoId = uuidv4();

  return toDoRepository.createToDo({
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
  return toDoRepository.updateToDo(updateTodoRequest, todoId, userId);
}

export function deleteToDo(todoId: string, jwtToken: string): Promise<string> {
  const userId = parseUserId(jwtToken);
  return toDoRepository.deleteToDo(todoId, userId);
}

export function generateUploadUrl(todoId: string): Promise<string> {
  return toDoRepository.generateUploadUrl(todoId);
}
