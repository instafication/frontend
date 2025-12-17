interface FetchContextOptions {
	req: Request;
	resHeaders: Headers;
}

export function createContext({ req, resHeaders }: FetchContextOptions) {
	const user = { name: req.headers.get('username') ?? 'anonymous' };
	return { req, resHeaders, user };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
