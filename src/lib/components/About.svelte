<script lang="ts">
	import { ChevronDown, Sparkles } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { ABOUT_TIMELINE, DAILY_STACK, SKILLS, SITE } from '$lib/portfolio/config';
	import { registerGsap, gsap, ScrollTrigger } from '$lib/utils/gsap';

	let section: HTMLElement;
	let track: HTMLElement;
	let reduce = false;

	onMount(() => {
		registerGsap();
		reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduce || !section || !track) return;

		const getScroll = () => Math.max(track.scrollWidth - window.innerWidth, 1);

		const st = ScrollTrigger.create({
			trigger: section,
			start: 'top top',
			end: () => `+=${getScroll()}`,
			pin: true,
			scrub: 0.6,
			animation: gsap.to(track, { x: () => -getScroll(), ease: 'none' })
		});

		ScrollTrigger.batch('[data-skill]', {
			start: 'top 85%',
			onEnter: (els) => {
				els.forEach((el) => {
					const bar = el.querySelector('[data-bar]') as HTMLElement | null;
					const w = el.getAttribute('data-width') ?? '0';
					if (bar) gsap.to(bar, { width: `${w}%`, duration: 1.1, ease: 'power2.out' });
				});
			}
		});

		ScrollTrigger.batch('[data-icon]', {
			start: 'top 88%',
			onEnter: (els) => {
				gsap.from(els, { opacity: 0, y: 18, stagger: 0.05, duration: 0.45, ease: 'power2.out' });
			}
		});

		return () => {
			st.kill();
			ScrollTrigger.getAll().forEach((t) => {
				if (t.trigger === section) t.kill();
			});
		};
	});

	function chipEnter(e: MouseEvent, el: HTMLElement) {
		if (!browser) return;
		registerGsap();
		if (reduce) return;
		const r = el.getBoundingClientRect();
		const mx = e.clientX - r.left - r.width / 2;
		const my = e.clientY - r.top - r.height / 2;
		gsap.to(el, { x: mx * 0.12, y: my * 0.12, duration: 0.35, ease: 'power2.out' });
	}
	function chipLeave(el: HTMLElement) {
		if (!browser) return;
		registerGsap();
		if (reduce) return;
		gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
	}
</script>

<section
	bind:this={section}
	class="section-inner relative overflow-hidden py-28"
	style="background: var(--bg-elevated)"
	id="about"
>
	<div
		class="pointer-events-none absolute inset-0 opacity-[0.07]"
		style="background-image: linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px); background-size: 48px 48px"
		aria-hidden="true"
	></div>

	<div class="relative mx-auto max-w-6xl px-4">
		<p class="font-heading text-accent-honey mb-2 text-xs font-semibold tracking-[0.2em] uppercase">
			Story & stack
		</p>
		<h2 class="font-display text-gradient-title mb-4 text-4xl font-extrabold md:text-6xl">About</h2>
		<p class="font-body mb-4 max-w-2xl text-lg leading-relaxed" style="color: var(--text-muted)">
			Scroll the page to scrub this horizontal strip — each panel is a waypoint. Hover the stack chips for a
			small nudge.
		</p>
		<p
			class="font-body mb-12 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm"
			style="border-color: var(--border-subtle); color: var(--text-muted)"
		>
			<ChevronDown size={16} class="text-[var(--accent-grass)]" />
			Keep scrolling to drive the timeline
		</p>
	</div>

	<div class="relative h-[min(70vh,520px)] w-full touch-pan-y overflow-hidden">
		<div bind:this={track} class="flex h-full w-max items-stretch gap-6 px-4 md:gap-10 md:px-10">
			<div
				class="interactive-card flex w-[85vw] shrink-0 flex-col justify-center rounded-2xl border p-8 md:w-[min(520px,45vw)]"
				style="border-color: var(--border-subtle); background: var(--bg-card)"
			>
				<p class="font-heading text-accent-honey text-sm uppercase">Hello</p>
				<p class="font-body mt-3 text-lg leading-relaxed" style="color: var(--text-primary)">
					I'm <strong>{SITE.name.split(' ')[0]}</strong> — {SITE.title}. Built this lane so the page feels less
					like a resume and more like a walkthrough.
				</p>
			</div>
			{#each ABOUT_TIMELINE as item}
				<div
					class="interactive-card flex w-[85vw] shrink-0 flex-col justify-center rounded-2xl border p-8 md:w-[min(420px,38vw)]"
					style="border-color: var(--border-subtle); background: var(--bg-card)"
				>
					<p class="font-display text-accent-grass text-5xl font-black tabular-nums md:text-6xl">{item.year}</p>
					<p class="font-body mt-4 text-base leading-relaxed" style="color: var(--text-muted)">
						{item.text}
					</p>
				</div>
			{/each}
			<div
				class="interactive-card flex w-[85vw] shrink-0 flex-col justify-center gap-6 rounded-2xl border p-8 md:w-[min(560px,50vw)]"
				style="border-color: var(--border-subtle); background: var(--bg-card)"
			>
				<p class="font-heading text-accent-honey text-sm uppercase">Skills</p>
				<div class="flex flex-col gap-5">
					{#each SKILLS as s}
						<div data-skill data-width={s.pct}>
							<div class="mb-1 flex justify-between text-sm" style="color: var(--text-primary)">
								<span class="font-medium">{s.label}</span><span class="tabular-nums">{s.pct}%</span>
							</div>
							<div
								class="skill-bar-shine h-2.5 overflow-hidden rounded-full"
								style="background: var(--border-subtle)"
							>
								<div
									data-bar
									class="h-full rounded-full shadow-[0_0_12px_var(--glow-grass)]"
									style="width: 0%; background: linear-gradient(90deg, var(--accent-grass-dim), var(--accent-grass))"
								></div>
							</div>
						</div>
					{/each}
				</div>
			</div>
			<div
				class="interactive-card flex w-[85vw] shrink-0 flex-col justify-center rounded-2xl border p-8 md:w-[min(480px,42vw)]"
				style="border-color: var(--border-subtle); background: var(--bg-card)"
			>
				<p class="font-heading text-accent-honey mb-2 text-sm uppercase">Daily stack</p>
				<p class="font-body mb-4 text-sm" style="color: var(--text-muted)">Hover — tiny magnetic wiggle.</p>
				<div class="flex flex-wrap gap-3">
					{#each DAILY_STACK as t}
						<span
							data-icon
							role="presentation"
							class="inline-block cursor-default rounded-full border px-4 py-2 text-sm font-medium shadow-sm"
							style="border-color: var(--border-subtle); color: var(--text-primary); background: color-mix(in srgb, var(--bg-elevated) 88%, transparent)"
							onmouseenter={(e) => chipEnter(e, e.currentTarget)}
							onmousemove={(e) => chipEnter(e, e.currentTarget)}
							onmouseleave={(e) => chipLeave(e.currentTarget)}
						>
							{t}
						</span>
					{/each}
				</div>
				<div
					class="border-accent-grass mt-10 flex h-24 w-24 items-center justify-center rounded-full border-2 text-3xl shadow-[0_0_36px_var(--glow-grass)] transition-transform duration-500 hover:scale-105 hover:rotate-6"
					style="border-color: var(--accent-grass); background: radial-gradient(circle at 30% 25%, color-mix(in srgb, var(--accent-honey) 35%, transparent), transparent 55%)"
					aria-hidden="true"
				>
					<Sparkles size={36} class="text-[var(--accent-honey)]" strokeWidth={1.75} />
				</div>
			</div>
		</div>
	</div>
</section>
