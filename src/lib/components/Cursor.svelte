<script lang="ts">
	import { onMount } from 'svelte';
	import { registerGsap, gsap } from '$lib/utils/gsap';

	let ring: HTMLDivElement | undefined;
	let reduce = false;
	let fine = true;

	onMount(() => {
		registerGsap();
		reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		fine = window.matchMedia('(pointer: fine)').matches;
		if (reduce || !fine || !ring) return;

		const quickX = gsap.quickTo(ring, 'left', { duration: 0.28, ease: 'power3.out' });
		const quickY = gsap.quickTo(ring, 'top', { duration: 0.28, ease: 'power3.out' });

		const move = (e: MouseEvent) => {
			quickX(e.clientX);
			quickY(e.clientY);
		};
		window.addEventListener('mousemove', move, { passive: true });
		return () => window.removeEventListener('mousemove', move);
	});
</script>

{#if !reduce && fine}
	<div
		bind:this={ring}
		class="pointer-events-none fixed z-[95] h-8 w-8 rounded-full border-2 border-[var(--accent-grass)] opacity-80 mix-blend-difference"
		style="left: 0; top: 0; transform: translate(-50%, -50%);"
		aria-hidden="true"
	></div>
{/if}
