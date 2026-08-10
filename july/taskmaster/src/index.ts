#!/usr/bin/env node
import * as readline from "readline";
import chalk from "chalk";
import { TodoManager } from "./TodoManager";
import { Todo } from "./types";

const manager = new TodoManager();

// ─── Formatting helpers ───────────────────────────────────────────────────────

function formatTodo(todo: Todo): string {
  const id     = chalk.dim(`#${todo.id}`);
  const status = todo.status === "done"
    ? chalk.green("✔ done   ")
    : chalk.yellow("○ pending");
  const title  = todo.status === "done"
    ? chalk.dim(todo.title)
    : chalk.white(todo.title);
  const date   = chalk.dim(new Date(todo.createdAt).toLocaleDateString());
  return `  ${id}  ${status}  ${title}  ${date}`;
}

function printTodos(todos: Todo[]): void {
  if (todos.length === 0) {
    console.log(chalk.dim('  No todos yet. Try: add "buy milk"'));
    return;
  }
  todos.forEach((t) => console.log(formatTodo(t)));
  const done = todos.filter((t) => t.status === "done").length;
  console.log(chalk.dim(`\n  ${done}/${todos.length} completed`));
}

function printHelp(): void {
  console.log(`
  ${chalk.bold("Commands")}
  ${chalk.cyan("add")} ${chalk.dim("<title>")}       Add a new todo
  ${chalk.cyan("list")}               Show all todos
  ${chalk.cyan("list --pending")}     Show only pending
  ${chalk.cyan("list --done")}        Show only completed
  ${chalk.cyan("done")} ${chalk.dim("<id>")}         Mark a todo as done
  ${chalk.cyan("delete")} ${chalk.dim("<id>")}       Delete a todo
  ${chalk.cyan("help")}               Show this help
  ${chalk.cyan("exit")}               Quit the app
  `);
}

// ─── Command dispatcher ───────────────────────────────────────────────────────

function dispatch(line: string): void {
  const parts = line.trim().split(/\s+/);
  const cmd   = parts[0].toLowerCase();

  switch (cmd) {
    case "add": {
      // Rejoin everything after "add", strip surrounding quotes
      const title = parts.slice(1).join(" ").replace(/^["']|["']$/g, "").trim();
      if (!title) {
        console.log(chalk.red('  Usage: add "your task title"'));
        break;
      }
      const todo = manager.add(title);
      console.log(chalk.green("  ✔ Added") + chalk.dim(` #${todo.id}`) + `  ${todo.title}`);
      break;
    }

    case "list": {
      let todos = manager.getAll();
      const flag = parts[1];
      if (flag === "--pending") todos = todos.filter((t) => t.status === "pending");
      if (flag === "--done")    todos = todos.filter((t) => t.status === "done");
      console.log(chalk.bold("\n  Todo List"));
      console.log(chalk.dim("  " + "─".repeat(38)));
      printTodos(todos);
      console.log();
      break;
    }

    case "done": {
      const id = parseInt(parts[1], 10);
      if (isNaN(id)) { console.log(chalk.red("  Usage: done <id>")); break; }
      const todo = manager.complete(id);
      if (!todo) { console.log(chalk.red(`  No todo found with id ${id}`)); break; }
      console.log(chalk.green("  ✔ Completed") + chalk.dim(` #${todo.id}`) + `  ${todo.title}`);
      break;
    }

    case "delete": {
      const id = parseInt(parts[1], 10);
      if (isNaN(id)) { console.log(chalk.red("  Usage: delete <id>")); break; }
      const ok = manager.delete(id);
      if (!ok) { console.log(chalk.red(`  No todo found with id ${id}`)); break; }
      console.log(chalk.red("  ✖ Deleted") + chalk.dim(` #${id}`));
      break;
    }

    case "help":
    case "?":
      printHelp();
      break;

    case "":
      break; // user just pressed Enter — do nothing

    default:
      console.log(chalk.red(`  Unknown command: "${cmd}". Type help for a list of commands.`));
  }
}

// ─── REPL loop ────────────────────────────────────────────────────────────────

const rl = readline.createInterface({
  input:  process.stdin,
  output: process.stdout,
});

console.log(chalk.bold.cyan("\n  ✅ TodoMaster"));
console.log(chalk.dim('  Type "help" to see commands. Type "exit" to quit.\n'));

rl.setPrompt(chalk.cyan("todo> "));
rl.prompt();

rl.on("line", (line: string) => {
  const input = line.trim();

  // Exit delimiter
  if (input === "exit" || input === "quit" || input === "q") {
    console.log(chalk.dim("\n  Bye!\n"));
    rl.close();
    process.exit(0);
  }

  dispatch(input);
  rl.prompt();
});

// Handle Ctrl+C gracefully
rl.on("close", () => {
  console.log(chalk.dim("\n  Bye!\n"));
  process.exit(0);
});
