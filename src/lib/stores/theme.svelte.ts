/** Theme: dark / light surfaces (forest + grass + honey palette) */
export const theme = $state({
	mode: 'dark' as 'dark' | 'light'
});

const STORAGE_KEY = 'saltzman-theme';

export function initThemeFromStorage() {
	if (typeof window === 'undefined') return;
	const saved = localStorage.getItem(STORAGE_KEY) as 'dark' | 'light' | null;
	if (saved === 'light' || saved === 'dark') theme.mode = saved;
	applyThemeClass();
}

export function toggleTheme() {
	theme.mode = theme.mode === 'dark' ? 'light' : 'dark';
	if (typeof window !== 'undefined') {
		localStorage.setItem(STORAGE_KEY, theme.mode);
		applyThemeClass();
	}
}

export function applyThemeClass() {
	if (typeof document === 'undefined') return;
	document.documentElement.dataset.theme = theme.mode;
}
