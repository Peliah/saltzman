import { env } from '$env/dynamic/public';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = () => {
	const convexUrl = env.PUBLIC_CONVEX_URL?.trim() ?? '';
	return {
		convexUrl,
		hasConvex: convexUrl.length > 0
	};
};
