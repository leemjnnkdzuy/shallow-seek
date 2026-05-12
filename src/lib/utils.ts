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

export interface ChatFragment {
  type: string;
  files?: { file_name: string }[];
  content?: string;
}

export interface DeepSeekMessage {
  role: string;
  content?: string;
  text?: string;
  message_id?: string | number;
  id?: string | number;
  fragments?: ChatFragment[];
}

export interface FormattedMessage {
  role: string;
  content: string;
  files?: string[];
  id?: number | string;
}

export function formatDeepSeekMessages(msgs: DeepSeekMessage[]): FormattedMessage[] {
  if (!msgs || !Array.isArray(msgs)) return [];
  
  return msgs.map((m) => {
    let content = m.content || m.text || "";
    const files: string[] = [];
    
    if (m.fragments) {
      m.fragments.forEach((f) => {
        if (f.type === "FILE" && f.files) {
          f.files.forEach((file) => {
            if (file.file_name) files.push(file.file_name);
          });
        }
        if (!content && (f.type === "REQUEST" || f.type === "RESPONSE" || f.type === "TEXT" || f.type === "THINK")) {
          content += (content ? "\n" : "") + (f.content || "");
        }
      });
    }
    
    return {
      role: m.role?.toLowerCase() || "assistant",
      content,
      files,
      id: m.message_id || m.id
    };
  });
}
