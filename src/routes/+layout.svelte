<script lang="ts">
	import './layout.css';
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import ConvexInit from '$lib/components/ConvexInit.svelte';
	import ScrollProgress from '$lib/components/ScrollProgress.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import Cursor from '$lib/components/Cursor.svelte';
	import MusicPlayer from '$lib/components/MusicPlayer.svelte';
	import Chatbot from '$lib/components/Chatbot.svelte';
	import { initThemeFromStorage, applyThemeClass } from '$lib/stores/theme.svelte';

	let { data, children }: { data: { convexUrl: string; hasConvex: boolean }; children: Snippet } = $props();

	onMount(() => {
		initThemeFromStorage();
		applyThemeClass();
	});
</script>

<div class="relative z-10 min-h-svh overflow-x-hidden">
	<ScrollProgress />
	<Cursor />
	<ThemeToggle />
	<MusicPlayer />
	<Chatbot />
	{#if data.hasConvex}
		<ConvexInit url={data.convexUrl}>
			{@render children()}
		</ConvexInit>
	{:else}
		{@render children()}
	{/if}
</div>
