import { Todo, TodoStore } from "./types";
import { loadStore, saveStore } from "./storage";

export class TodoManager {
  private store: TodoStore;

  constructor() {
    this.store = loadStore();
  }

  // ── Create ────────────────────────────────────────────────────────────────

  add(title: string): Todo {
    const todo: Todo = {
      id: this.store.nextId++,
      title: title.trim(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    this.store.todos.push(todo);
    saveStore(this.store);
    return todo;
  }

  // ── Read ──────────────────────────────────────────────────────────────────

  getAll(): Todo[] {
    return this.store.todos;
  }

  getById(id: number): Todo | undefined {
    return this.store.todos.find((t) => t.id === id);
  }

  // ── Update ────────────────────────────────────────────────────────────────

  complete(id: number): Todo | null {
    const todo = this.store.todos.find((t) => t.id === id);
    if (!todo) return null;
    todo.status = "done";
    saveStore(this.store);
    return todo;
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  delete(id: number): boolean {
    const before = this.store.todos.length;
    this.store.todos = this.store.todos.filter((t) => t.id !== id);
    const deleted = this.store.todos.length < before;
    if (deleted) saveStore(this.store);
    return deleted;
  }
}
