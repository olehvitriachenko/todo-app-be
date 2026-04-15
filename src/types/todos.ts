export type TodoStatus = "Created" | "InProgress" | "Done";

export type Todo = {
  id: string;
  text: string;
  status: TodoStatus;
};

export type TodoRow = Omit<Todo, "status"> & {
  status: string;
};

export type CreateTodoRequest = Omit<Todo, "id">;

export type UpdateTodoRequest = Partial<Omit<Todo, "id">>;
