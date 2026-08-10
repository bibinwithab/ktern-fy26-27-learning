import * as fs from "fs";
import * as path from "path";
import { TodoStore } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "todos.json");

const EMPTY_STORE: TodoStore = { nextId: 1, todos: [] };

export function loadStore(): TodoStore {
  if (!fs.existsSync(DATA_FILE)) {
    return { ...EMPTY_STORE };
  }
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw) as TodoStore;
}

export function saveStore(store: TodoStore): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), "utf-8");
}
