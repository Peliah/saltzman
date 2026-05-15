export type MusicMood = 'focus' | 'chill' | 'late';

export const music = $state({
	/** Expanded player panel */
	expanded: false,
	playing: false,
	trackIndex: 0,
	volume: 0.45,
	mood: 'chill' as MusicMood
});

const STORAGE_MOOD = 'saltzman-music-mood';
const STORAGE_VOL = 'saltzman-music-vol';

export function initMusicFromStorage() {
	if (typeof window === 'undefined') return;
	const m = localStorage.getItem(STORAGE_MOOD) as MusicMood | null;
	if (m === 'focus' || m === 'chill' || m === 'late') music.mood = m;
	const v = localStorage.getItem(STORAGE_VOL);
	if (v != null) {
		const n = Number(v);
		if (!Number.isNaN(n)) music.volume = Math.min(1, Math.max(0, n));
	}
}

export function persistMusicPrefs() {
	if (typeof window === 'undefined') return;
	localStorage.setItem(STORAGE_MOOD, music.mood);
	localStorage.setItem(STORAGE_VOL, String(music.volume));
}

/** Served from `static/music/` → `/music/*.mp3`. Empty = no Howl requests (no 404). */
export const TRACKS: readonly { title: string; src: string }[] = [
	{ title: 'Lofi chill', src: '/music/lofi-chill.mp3' },
	{ title: 'Lofi girl', src: '/music/lofi-girl.mp3' },
	{ title: 'Lofi hip hop', src: '/music/lofi-hip-hop.mp3' }
];
