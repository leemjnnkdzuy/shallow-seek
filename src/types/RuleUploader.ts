export interface CachedRuleFiles {
	rulesFileId: string;
	toolsFileId: string | null;
	toolsHash: string;
	rulesHash: string;
	createdAt: number;
}
