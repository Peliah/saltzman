import { browser } from '$app/environment';

export type PortfolioView =
	| 'home'
	| 'about'
	| 'projects'
	| 'game'
	| 'guestbook'
	| 'contact'
	| 'hire';

const HASH_MAP: Record<PortfolioView, string> = {
	home: '',
	about: 'about',
	projects: 'projects',
	game: 'game',
	guestbook: 'guestbook',
	contact: 'contact',
	hire: 'hire'
};

const VALID = new Set(Object.keys(HASH_MAP) as PortfolioView[]);

function hashToView(hash: string): PortfolioView {
	const h = hash.replace(/^#/, '').toLowerCase();
	if (h === '' || h === 'top') return 'home';
	for (const [view, name] of Object.entries(HASH_MAP)) {
		if (name === h) return view as PortfolioView;
	}
	return 'home';
}

export const portfolio = $state({
	view: 'home' as PortfolioView
});

export function setPortfolioView(v: PortfolioView) {
	portfolio.view = v;
	if (!browser) return;
	const name = HASH_MAP[v];
	const url = `${window.location.pathname}${window.location.search}${name ? `#${name}` : ''}`;
	window.history.replaceState(window.history.state, '', url);
}

/** Call once on client to sync from URL and listen for back/forward */
export function initPortfolioViewFromHash() {
	if (!browser) return;
	const apply = () => {
		portfolio.view = hashToView(window.location.hash);
	};
	apply();
	window.addEventListener('hashchange', apply);
	return () => window.removeEventListener('hashchange', apply);
}

export function viewFromHash(hash: string): PortfolioView {
	return hashToView(hash);
}

export function isPortfolioView(s: string): s is PortfolioView {
	return VALID.has(s as PortfolioView);
}
