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

import type { DeepSeekMessage, FormattedMessage } from "@/types";

export function formatDeepSeekMessages(msgs: DeepSeekMessage[]): FormattedMessage[] {
  if (!msgs || !Array.isArray(msgs)) return [];
  
  return msgs.map((m) => {
    let content = m.content || m.text || "";
    const files: string[] = [];
    const search_results: any[] = [];
    
    if (m.search_results && Array.isArray(m.search_results)) {
      search_results.push(...m.search_results);
    }
    
    if (m.fragments) {
      m.fragments.forEach((f) => {
        if (f.type === "FILE" && f.files) {
          f.files.forEach((file) => {
            if (file.file_name) files.push(file.file_name);
          });
        }
        if (f.type === "SEARCH" && f.search_results) {
          search_results.push(...f.search_results);
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
      search_results,
      id: m.message_id || m.id
    };
  });
}
