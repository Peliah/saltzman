<script lang="ts">
	import { onMount } from 'svelte';
	import { Howl, Howler } from 'howler';
	import { music, TRACKS, initMusicFromStorage, persistMusicPrefs } from '$lib/stores/music.svelte';

	let howl: Howl | null = null;
	let raf = 0;
	const bars = $state<number[]>(Array.from({ length: 24 }, () => 0.1));

	onMount(() => {
		initMusicFromStorage();
		document.documentElement.dataset.mood = music.mood;
		return () => {
			cancelAnimationFrame(raf);
			howl?.unload();
		};
	});

	$effect(() => {
		document.documentElement.dataset.mood = music.mood;
		persistMusicPrefs();
	});

	$effect(() => {
		const vol = music.volume;
		howl?.volume(vol);
	});

	function loadTrack() {
		if (TRACKS.length === 0) return;
		const t = TRACKS[music.trackIndex % TRACKS.length];
		if (!t) return;
		howl?.unload();
		howl = new Howl({
			src: [t.src],
			html5: true,
			volume: music.volume,
			onplay: () => {
				music.playing = true;
			},
			onpause: () => {
				music.playing = false;
			},
			onstop: () => {
				music.playing = false;
			},
			onend: () => next(),
			onloaderror: () => {
				music.playing = false;
			}
		});
	}

	function animateBars() {
		const t = performance.now() / 280;
		for (let i = 0; i < bars.length; i++) {
			bars[i] = 0.15 + Math.abs(Math.sin(t + i * 0.35)) * 0.75;
		}
		raf = requestAnimationFrame(animateBars);
	}

	$effect(() => {
		if (music.playing) {
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(animateBars);
		} else {
			cancelAnimationFrame(raf);
			for (let i = 0; i < bars.length; i++) bars[i] = 0.12;
		}
		return () => cancelAnimationFrame(raf);
	});

	function togglePlay() {
		if (TRACKS.length === 0) return;
		if (!howl || howl.state() === 'unloaded') loadTrack();
		if (!howl) return;
		if (howl.playing()) howl.pause();
		else {
			void Howler.ctx?.resume?.();
			howl.volume(music.volume);
			howl.play();
		}
	}

	function next() {
		if (TRACKS.length === 0) return;
		music.trackIndex = (music.trackIndex + 1) % TRACKS.length;
		if (music.playing) {
			loadTrack();
			howl?.play();
		}
	}

	function prev() {
		if (TRACKS.length === 0) return;
		music.trackIndex = (music.trackIndex - 1 + TRACKS.length) % TRACKS.length;
		if (music.playing) {
			loadTrack();
			howl?.play();
		}
	}

	function setMood(m: typeof music.mood) {
		music.mood = m;
	}
</script>

<div class="pointer-events-none fixed right-4 bottom-4 z-[85] flex flex-col items-end gap-2 md:right-6 md:bottom-6">
	{#if music.expanded}
		<div
			class="pointer-events-auto border-border-subtle mb-2 w-[min(100vw-2rem,360px)] rounded-2xl border p-4 shadow-xl"
			style="border-color: var(--border-subtle); background: var(--bg-elevated)"
		>
			<div class="flex items-center gap-3">
				<div
					class="flex h-14 w-14 items-center justify-center rounded-full border-2"
					style="border-color: var(--accent-grass); {music.playing
						? 'animation: spin 8s linear infinite'
						: ''}"
				>
					<span class="text-lg">💿</span>
				</div>
				<div class="min-w-0 flex-1">
					<p class="font-heading truncate text-sm" style="color: var(--text-primary)">
						{TRACKS.length === 0 ? 'No tracks yet' : (TRACKS[music.trackIndex]?.title ?? 'Track')}
					</p>
					<p class="font-body text-xs" style="color: var(--text-muted)">Lo-fi playlist</p>
				</div>
			</div>
			<div class="mt-3 flex h-10 items-end gap-1">
				{#each bars as h, i (i)}
					<div
						class="w-1.5 rounded-sm bg-[var(--accent-grass)] opacity-80"
						style="height: {8 + h * 28}px"
					></div>
				{/each}
			</div>
			<div class="mt-4 flex items-center gap-2">
				<button
					type="button"
					class="rounded-lg border px-2 py-1 text-sm disabled:opacity-40"
					style="border-color: var(--border-subtle); color: var(--text-primary)"
					onclick={prev}
					disabled={TRACKS.length === 0}
					aria-label="Previous track"
				>
					◀
				</button>
				<button
					type="button"
					class="rounded-full px-4 py-2 text-sm font-semibold disabled:opacity-40"
					style="background: var(--accent-grass); color: var(--bg-deep)"
					onclick={togglePlay}
					disabled={TRACKS.length === 0}
				>
					{music.playing ? 'Pause' : 'Play'}
				</button>
				<button
					type="button"
					class="rounded-lg border px-2 py-1 text-sm disabled:opacity-40"
					style="border-color: var(--border-subtle); color: var(--text-primary)"
					onclick={next}
					disabled={TRACKS.length === 0}
					aria-label="Next track"
				>
					▶
				</button>
			</div>
			<label class="font-body mt-3 flex items-center gap-2 text-xs" style="color: var(--text-muted)">
				Volume
				<input type="range" min="0" max="1" step="0.05" bind:value={music.volume} class="flex-1" />
			</label>
			<div class="mt-3 flex flex-wrap gap-2">
				{#each ['focus', 'chill', 'late'] as m (m)}
					<button
						type="button"
						class="rounded-full px-3 py-1 text-xs capitalize"
						style="background: {music.mood === m ? 'var(--accent-honey)' : 'var(--bg-card)'}; color: {music.mood === m
							? 'var(--bg-deep)'
							: 'var(--text-muted)'}"
						onclick={() => setMood(m as typeof music.mood)}
					>
						{m}
					</button>
				{/each}
			</div>
			{#if TRACKS.length === 0}
				<p class="font-body mt-2 text-[10px]" style="color: var(--text-muted)">
					Add MP3s to <code class="font-mono">static/music/</code> and list them in
					<code class="font-mono">TRACKS</code> (<code class="font-mono">music.svelte.ts</code>).
				</p>
			{/if}
		</div>
	{/if}

	<button
		type="button"
		class="pointer-events-auto flex items-center gap-2 rounded-full border px-4 py-2 text-sm shadow-lg"
		style="border-color: var(--border-subtle); background: var(--bg-elevated); color: var(--text-primary)"
		onclick={() => (music.expanded = !music.expanded)}
		aria-expanded={music.expanded}
	>
		<span class="flex gap-0.5" aria-hidden="true">
			{#each [0, 1, 2] as i (i)}
				<span
					class="w-1 rounded-full bg-[var(--accent-grass)]"
					style="height: {music.playing ? 10 + (i % 3) * 4 : 6}px; transition: height 0.2s"
				></span>
			{/each}
		</span>
		Music
	</button>
</div>

<style>
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
