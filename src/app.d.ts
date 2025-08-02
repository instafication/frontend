// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			// user: User;
			language: string;
		}
		interface Platform {
			env: Env
			cf: CfProperties
			ctx: ExecutionContext
		}
		// interface PageData {}
	}
}


export {};
