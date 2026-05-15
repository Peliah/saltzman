<script lang="ts">
	import { onMount } from 'svelte';
	import { SITE } from '$lib/portfolio/config';
	import { registerGsap, gsap } from '$lib/utils/gsap';
	import { music } from '$lib/stores/music.svelte';

	let canvas: HTMLCanvasElement;
	let hero: HTMLElement;
	let reduce = false;

	const letters = [...SITE.name];

	onMount(() => {
		registerGsap();
		reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		let raf = 0;
		const ctx = canvas.getContext('2d');
		const stars: { x: number; y: number; r: number; a: number }[] = [];
		const resize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			stars.length = 0;
			const n = reduce ? 40 : 120;
			for (let i = 0; i < n; i++) {
				stars.push({
					x: Math.random() * canvas.width,
					y: Math.random() * canvas.height,
					r: Math.random() * 1.2 + 0.2,
					a: Math.random() * 0.5 + 0.2
				});
			}
		};
		let t = 0;
		const loop = () => {
			if (!ctx) return;
			t += 0.015;
			const bg =
				getComputedStyle(document.documentElement).getPropertyValue('--bg-deep').trim() || '#0c100d';
			ctx.fillStyle = bg;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			for (const s of stars) {
				ctx.beginPath();
				ctx.globalAlpha = Math.min(1, Math.max(0.05, s.a + Math.sin(t + s.x * 0.01) * 0.08));
				ctx.fillStyle = '#fff';
				ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
				ctx.fill();
			}
			ctx.globalAlpha = 1;
			raf = requestAnimationFrame(loop);
		};
		resize();
		window.addEventListener('resize', resize);
		raf = requestAnimationFrame(loop);

		if (!reduce && hero) {
			const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
			const nameSpans = hero.querySelectorAll('[data-letter]');
			tl.from(nameSpans, { y: 56, opacity: 0, stagger: 0.04, duration: 0.65 }, 0);
			tl.from('[data-title]', { opacity: 0, y: 12, duration: 0.8 }, 0.35);
			tl.from('[data-cta]', { y: 24, opacity: 0, stagger: 0.12, duration: 0.5 }, '-=0.35');
			tl.to(
				'[data-scroll]',
				{ y: 6, duration: 0.9, repeat: -1, yoyo: true, ease: 'sine.inOut' },
				'-=0.2'
			);
		}

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('resize', resize);
		};
	});

	function scrollToProjects() {
		document.getElementById('projects')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
	}
</script>

<section
	bind:this={hero}
	class="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 pt-16 pb-28"
	id="top"
>
	<canvas bind:this={canvas} class="pointer-events-none absolute inset-0 h-full w-full"></canvas>
	<div
		class="relative z-10 flex max-w-4xl flex-col items-center text-center"
		style="color: var(--text-primary)"
	>
		<p class="font-heading text-accent-honey mb-2 text-sm tracking-widest uppercase">Portfolio</p>
		<h1 class="font-display text-5xl font-extrabold tracking-tight sm:text-7xl md:text-8xl">
			<span class="inline-flex flex-wrap justify-center gap-0.5 sm:gap-1">
				{#each letters as ch, i (i)}
					<span data-letter class="inline-block">{ch === ' ' ? '\u00a0' : ch}</span>
				{/each}
			</span>
		</h1>
		<p
			data-title
			class="font-body text-text-muted mt-6 max-w-xl text-lg sm:text-xl"
			style="color: var(--text-muted)"
		>
			{SITE.title}
		</p>
		<p class="font-body text-text-muted mt-4 max-w-md text-sm" style="color: var(--text-muted)">
			{SITE.tagline}
		</p>
		<div class="mt-10 flex flex-wrap items-center justify-center gap-4">
			<a
				data-cta
				href={SITE.resumePath}
				class="rounded-full px-8 py-3 text-sm font-semibold transition-colors"
				style="background: var(--accent-grass); color: var(--bg-deep)"
				download
			>
				Download resume
			</a>
			<button
				data-cta
				type="button"
				class="rounded-full border-2 px-8 py-3 text-sm font-semibold transition-colors"
				style="border-color: var(--accent-grass); color: var(--text-primary)"
				onclick={scrollToProjects}
			>
				View projects
			</button>
			<button
				data-cta
				type="button"
				class="rounded-full border px-5 py-3 text-sm transition-colors"
				style="border-color: var(--border-subtle); color: var(--text-muted)"
				onclick={() => (music.expanded = true)}
			>
				Lo-fi radio
			</button>
		</div>
	</div>
	<div
		data-scroll
		class="font-body absolute bottom-8 flex flex-col items-center gap-2 text-xs"
		style="color: var(--text-muted)"
	>
		<span>Scroll</span>
		<span class="text-lg" aria-hidden="true">↓</span>
	</div>
</section>
