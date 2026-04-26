import Database from "better-sqlite3";

export const db = new Database("todo.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'created'
    )
    `);

db.exec(`
    UPDATE todos
    SET status = CASE status
      WHEN 'Created' THEN 'created'
      WHEN 'InProgress' THEN 'in_progress'
      WHEN 'Done' THEN 'done'
      ELSE status
    END
    `);
