import Database from "better-sqlite3";
import path from "node:path";
import {app} from "electron";
import fs from "node:fs";
import type {Account} from "@/types";

const userDataPath = app.getPath("userData");
const dbDir = path.join(userDataPath, "database");

if (!fs.existsSync(dbDir)) {
	fs.mkdirSync(dbDir, {recursive: true});
}

const dbPath = path.join(dbDir, "shallow-seek.db");
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    chat_token TEXT NOT NULL,
    platform_token TEXT,
    proxy TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

try {
	db.exec(`ALTER TABLE accounts RENAME COLUMN token TO chat_token;`);
} catch (e) {
	/* ignore */
}
try {
	db.exec(`ALTER TABLE accounts ADD COLUMN platform_token TEXT;`);
} catch (e) {
	/* ignore */
}
try {
	db.exec(`ALTER TABLE accounts ADD COLUMN proxy TEXT;`);
} catch (e) {
	/* ignore */
}

db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

export const addAccount = (account: Account) => {
	const stmt = db.prepare(
		"INSERT OR REPLACE INTO accounts (id, email, chat_token, platform_token, proxy) VALUES (?, ?, ?, ?, ?)",
	);
	return stmt.run(
		account.id,
		account.email,
		account.chat_token,
		account.platform_token || null,
		account.proxy || null,
	);
};

export const getAccounts = (): Account[] => {
	const stmt = db.prepare("SELECT * FROM accounts ORDER BY created_at DESC");
	return stmt.all() as Account[];
};

export const deleteAccount = (id: string) => {
	const stmt = db.prepare("DELETE FROM accounts WHERE id = ?");
	return stmt.run(id);
};

export const checkAccountExists = (email: string): boolean => {
	const stmt = db.prepare(
		"SELECT COUNT(*) as count FROM accounts WHERE LOWER(email) = LOWER(?)",
	);
	const result = stmt.get(email.trim()) as {count: number};
	return result.count > 0;
};

export const getSetting = (key: string): string | null => {
	const stmt = db.prepare("SELECT value FROM settings WHERE key = ?");
	const result = stmt.get(key) as {value: string} | undefined;
	return result ? result.value : null;
};

export const setSetting = (key: string, value: string) => {
	const stmt = db.prepare(
		"INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)",
	);
	return stmt.run(key, value);
};

export const getAllSettings = (): Record<string, string> => {
	const stmt = db.prepare("SELECT * FROM settings");
	const rows = stmt.all() as {key: string; value: string}[];
	return rows.reduce((acc, row) => ({...acc, [row.key]: row.value}), {});
};

export const getProxyForToken = (token: string): string | null => {
	if (!token) return null;
	try {
		const stmt = db.prepare("SELECT proxy FROM accounts WHERE chat_token = ? OR platform_token = ?");
		const result = stmt.get(token, token) as {proxy: string | null} | undefined;
		return result ? result.proxy : null;
	} catch (e) {
		return null;
	}
};
