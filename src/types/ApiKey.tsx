export interface ApiKey {
	created_at: number;
	last_use: string | null;
	tracking_id: string;
	sensitive_id: string;
	name: string;
}

export interface FetchKeysCallbacks {
	setKeys: (keys: ApiKey[]) => void;
	setPlatformToken: (token: string | null) => void;
	setError40003: (error: boolean) => void;
	setLoading: (loading: boolean) => void;
}
