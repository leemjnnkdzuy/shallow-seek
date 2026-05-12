import Database from 'better-sqlite3';
import path from 'node:path';
import { app } from 'electron';
import fs from 'node:fs';

const userDataPath = app.getPath('userData');
const dbDir = path.join(userDataPath, 'database');

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'shallow-seek.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    token TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export interface Account {
  id: string;
  email: string;
  token: string;
}

export const addAccount = (account: Account) => {
  const stmt = db.prepare('INSERT OR REPLACE INTO accounts (id, email, token) VALUES (?, ?, ?)');
  return stmt.run(account.id, account.email, account.token);
};

export const getAccounts = (): Account[] => {
  const stmt = db.prepare('SELECT * FROM accounts ORDER BY created_at DESC');
  return stmt.all() as Account[];
};

export const deleteAccount = (id: string) => {
  const stmt = db.prepare('DELETE FROM accounts WHERE id = ?');
  return stmt.run(id);
};

export const checkAccountExists = (email: string): boolean => {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM accounts WHERE email = ?');
  const result = stmt.get(email) as { count: number };
  return result.count > 0;
};
