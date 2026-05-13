import type { ChatSessionSummary } from "@/types";

export function parseChatSession(session: unknown): ChatSessionSummary | null {
	if (!session || typeof session !== "object") return null;
	const record = session as Record<string, unknown>;
	const id = record.id;
	const updatedAt = record.updated_at;
	if (
		(typeof id !== "string" && typeof id !== "number") ||
		typeof updatedAt !== "number"
	) {
		return null;
	}
	const title = typeof record.title === "string" ? record.title : undefined;
	return { id: String(id), title, updated_at: updatedAt };
}

export async function handleDeleteSession(
	sessionId: string,
	accountToken: string | null | undefined,
	selectedSession: string | null | undefined,
	callbacks: {
		fetchHistory: () => void;
		setSelectedSession: (sessionId: string | null) => void;
	}
) {
	if (!accountToken) return;

	const confirmed = await window.electron?.windowControls.openConfirm({
		title: "",
		message:
			"Bạn có chắc chắn muốn xóa cuộc trò chuyện này? Hành động này không thể hoàn tác.",
		confirmText: "Xóa",
		cancelText: "Hủy",
		variant: "destructive",
		type: "danger",
	});

	if (confirmed) {
		try {
			const res = await window.electron?.deepseek?.deleteChatSession({
				token: accountToken,
				sessionId,
			});
			if (res?.ok) {
				callbacks.fetchHistory();
				if (selectedSession === sessionId) {
					callbacks.setSelectedSession(null);
				}
			} else {
				console.error("Failed to delete session:", res?.error);
			}
		} catch (err) {
			console.error("Delete session error:", err);
		}
	}
}
