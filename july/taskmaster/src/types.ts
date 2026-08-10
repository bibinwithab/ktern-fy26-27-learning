// ─── Data Types ───────────────────────────────────────────────────────────────

export type TodoStatus = "pending" | "done";

export interface Todo {
  id: number;
  title: string;
  status: TodoStatus;
  createdAt: string; // ISO date string
}

// Shape of the JSON file on disk
export interface TodoStore {
  nextId: number;
  todos: Todo[];
}
