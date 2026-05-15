<script lang="ts">
	import { onMount } from 'svelte';

	let pct = $state(0);

	const MAIN_SCROLL_ID = 'portfolio-scroll-main';

	onMount(() => {
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduce) return;

		let scrollEl: HTMLElement | null = null;
		let raf = 0;

		const onScroll = () => {
			const el = scrollEl;
			if (el) {
				const max = el.scrollHeight - el.clientHeight;
				pct = max > 0 ? (el.scrollTop / max) * 100 : 0;
			} else {
				const doc = document.documentElement;
				const max = doc.scrollHeight - doc.clientHeight;
				pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
			}
		};

		const bind = () => {
			cancelAnimationFrame(raf);
			scrollEl = document.getElementById(MAIN_SCROLL_ID);
			if (!scrollEl) {
				raf = requestAnimationFrame(bind);
				return;
			}
			scrollEl.addEventListener('scroll', onScroll, { passive: true });
			onScroll();
		};

		bind();

		return () => {
			cancelAnimationFrame(raf);
			scrollEl?.removeEventListener('scroll', onScroll);
		};
	});
</script>

<div
	class="pointer-events-none fixed top-0 right-0 left-0 z-[100] h-0.5 origin-left bg-[var(--accent-grass)] transition-[transform] duration-150"
	style="transform: scaleX({pct / 100})"
	aria-hidden="true"
></div>
