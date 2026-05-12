import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const maskIdentifier = (value: string) => {
	if (!value) return "";

	if (value.includes("@")) {
		const [localPart, domain] = value.split("@");
		const localMasked =
			localPart.length <= 2 ?
				`${localPart[0] ?? "*"}*`
			:	`${localPart.slice(0, 2)}***`;
		return `${localMasked}@${domain}`;
	}

	if (value.length <= 4) {
		return `${value[0] ?? "*"}***`;
	}

	return `${value.slice(0, 2)}***${value.slice(-2)}`;
};

export const previewValue = (value: unknown, maxLen = 4000) => {
	if (value == null) return "";

	if (typeof value === "string") {
		return value.length > maxLen ?
				`${value.slice(0, maxLen)}…(truncated)`
			:	value;
	}

	try {
		const json = JSON.stringify(value);
		return json.length > maxLen ?
				`${json.slice(0, maxLen)}…(truncated)`
			:	json;
	} catch {
		return String(value);
	}
};
