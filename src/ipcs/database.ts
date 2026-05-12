import {ipcMain} from "electron";
import {addAccount, getAccounts, deleteAccount, checkAccountExists} from "../services/QueryDB";

export function registerDatabaseIpcs() {
	ipcMain.handle("db-add-account", async (_event, account) => {
		try {
			addAccount(account);
			return {success: true};
		} catch (error: any) {
			return {success: false, error: error.message};
		}
	});

	ipcMain.handle("db-get-accounts", async () => {
		try {
			const accounts = getAccounts();
			return {success: true, data: accounts};
		} catch (error: any) {
			return {success: false, error: error.message};
		}
	});

	ipcMain.handle("db-delete-account", async (_event, id) => {
		try {
			deleteAccount(id);
			return {success: true};
		} catch (error: any) {
			return {success: false, error: error.message};
		}
	});

	ipcMain.handle("db-check-account-exists", async (_event, email) => {
		try {
			const exists = checkAccountExists(email);
			return {success: true, exists};
		} catch (error: any) {
			return {success: false, error: error.message};
		}
	});
}
