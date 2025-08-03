export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
	public: {
		Tables: {
			Scraper: {
				Row: {
					id: string;
					last_update: number | null;
				};
				Insert: {
					id: string;
					last_update?: number | null;
				};
				Update: {
					id?: string;
					last_update?: number | null;
				};
			};
			Users: {
				Row: {
					active: boolean | null;
					area: string | null;
					created_at: string | null;
					credits: number | null;
					email: string | null;
					id: string;
					name: string | null;
					phone: string | null;
				};
				Insert: {
					active?: boolean | null;
					area?: string | null;
					created_at?: string | null;
					credits?: number | null;
					email?: string | null;
					id: string;
					name?: string | null;
					phone?: string | null;
				};
				Update: {
					active?: boolean | null;
					area?: string | null;
					created_at?: string | null;
					credits?: number | null;
					email?: string | null;
					id?: string;
					name?: string | null;
					phone?: string | null;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}
