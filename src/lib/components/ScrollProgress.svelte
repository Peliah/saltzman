<script lang="ts">
	import { onMount } from 'svelte';

	let pct = $state(0);

	onMount(() => {
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const onScroll = () => {
			const doc = document.documentElement;
			const max = doc.scrollHeight - doc.clientHeight;
			pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
		};
		if (!reduce) {
			window.addEventListener('scroll', onScroll, { passive: true });
			onScroll();
			return () => window.removeEventListener('scroll', onScroll);
		}
	});
</script>

<div
	class="pointer-events-none fixed top-0 right-0 left-0 z-[100] h-0.5 origin-left bg-[var(--accent-grass)] transition-[transform] duration-150"
	style="transform: scaleX({pct / 100})"
	aria-hidden="true"
></div>
