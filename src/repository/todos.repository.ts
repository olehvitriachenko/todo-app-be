import { Todo, TodoRow, TodoStatus } from "../types/todos";
import { CreateTodoRequest, UpdateTodoRequest } from "@/types/todos";
import { db } from "../db/db";
import { v4 as uuid } from "uuid";

const mapTodo = (row: TodoRow): Todo => ({
  id: row.id,
  text: row.text,
  status: row.status as TodoStatus,
});

export const getTodoList = (): Todo[] => {
  const rows = db.prepare("SELECT * FROM todos").all() as TodoRow[];

  return rows.map(mapTodo);
};

export const getTodoItem = (id: string): Todo | null => {
  const row = db.prepare("SELECT * FROM todos WHERE id = ?").get(id) as TodoRow;
  return mapTodo(row);
};

export const createTodoItem = (data: CreateTodoRequest): Todo => {
  const id = uuid();
  db.prepare(
    `
        INSERT INTO todos (id, text, status)
        VALUES (?, ?, ?)
        `,
  ).run(id, data.text, data.status ?? "Created");

  const todo = getTodoItem(id);

  if (!todo) throw new Error("Failed to create");

  return todo;
};

export const updateTodoItem = (
  id: string,
  data: UpdateTodoRequest,
): Todo | null => {
  const existing = getTodoItem(id);

  if (!existing) return null;

  db.prepare(
    `
    UPDATE todos
    SET text = ?, status = ?
    WHERE id = ?
    `,
  ).run(
    data.text ?? existing.text,
    data.status ?? existing.status,
    id,
  );

  return getTodoItem(id);
};

export const deleteTodoItem = (id: string): boolean => {
  const result = db
    .prepare(
      `
        DELETE FROM todos WHERE id = ?
        `,
    )
    .run(id);

  return result.changes > 0;
};
