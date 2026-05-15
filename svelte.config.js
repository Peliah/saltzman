import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
	const config = {
	kit: {
		// Pin serverless runtime so local builds on Node 25+ still complete (adapter checks process.version).
		adapter: adapter({ runtime: 'nodejs24.x' }),
		alias: {
			$convex: 'convex'
		}
	}
};

export default config;
