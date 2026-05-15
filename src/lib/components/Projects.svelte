<script lang="ts">
	import { ArrowRight, X } from '@lucide/svelte';
	import { tick } from 'svelte';
	import { browser } from '$app/environment';
	import { PROJECTS, type Project, type ProjectCategory } from '$lib/portfolio/config';
	import { registerGsap, gsap } from '$lib/utils/gsap';
	import { onMount } from 'svelte';

	let filter: ProjectCategory = $state('all');
	let modal: Project | null = $state(null);
	let backdropEl: HTMLButtonElement | undefined;
	let panelEl: HTMLDivElement | undefined;

	const categories: ProjectCategory[] = ['all', 'frontend', 'backend', 'fullstack'];

	const filtered = $derived(
		filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.category === filter)
	);

	function setFilter(c: ProjectCategory) {
		filter = c;
	}

	onMount(() => {
		registerGsap();
	});

	$effect(() => {
		if (!browser) return;
		void filter;
		const cards = document.querySelectorAll('[data-project-card]');
		if (cards.length === 0) return;
		registerGsap();
		gsap.fromTo(
			cards,
			{ opacity: 0.2, y: 24, rotateX: 4 },
			{ opacity: 1, y: 0, rotateX: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out' }
		);
	});

	$effect(() => {
		if (!browser || !modal) return;
		void tick().then(() => {
			if (!backdropEl || !panelEl) return;
			if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
				backdropEl.style.opacity = '1';
				panelEl.style.opacity = '1';
				panelEl.style.transform = 'none';
				return;
			}
			registerGsap();
			gsap.fromTo(backdropEl, { opacity: 0 }, { opacity: 1, duration: 0.28, ease: 'power1.out' });
			gsap.fromTo(
				panelEl,
				{ opacity: 0, scale: 0.9, y: 28 },
				{ opacity: 1, scale: 1, y: 0, duration: 0.48, ease: 'power3.out' }
			);
		});
	});

	function tilt(e: MouseEvent, el: HTMLElement) {
		const r = el.getBoundingClientRect();
		const x = e.clientX - r.left;
		const y = e.clientY - r.top;
		const rx = ((y - r.height / 2) / r.height) * -10;
		const ry = ((x - r.width / 2) / r.width) * 10;
		el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
	}
	function resetTilt(el: HTMLElement) {
		el.style.transform = '';
	}

	function closeModal() {
		modal = null;
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape') closeModal();
	}
</script>

<svelte:window onkeydown={onKey} />

<section
	class="section-inner relative overflow-hidden py-28"
	style="background: var(--bg-deep)"
	id="projects"
>
	<div
		class="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full opacity-[0.12] blur-3xl"
		style="background: radial-gradient(circle, var(--accent-grass), transparent 70%)"
		aria-hidden="true"
	></div>
	<div
		class="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full opacity-[0.1] blur-3xl"
		style="background: radial-gradient(circle, var(--accent-honey), transparent 70%)"
		aria-hidden="true"
	></div>

	<div class="relative mx-auto max-w-6xl px-4">
		<p class="font-heading text-accent-honey mb-2 text-xs font-semibold tracking-[0.2em] uppercase">
			Selected work
		</p>
		<h2 class="font-display text-gradient-title mb-4 text-4xl font-extrabold md:text-6xl">Projects</h2>
		<p class="font-body mb-10 max-w-2xl text-lg leading-relaxed" style="color: var(--text-muted)">
			Filter the wall, tilt the cards, open for detail — built to feel a bit like a shelf of artifacts, not a
			default grid.
		</p>

		<div class="mb-10 flex flex-wrap gap-3" role="tablist" aria-label="Project categories">
			{#each categories as c (c)}
				<button
					type="button"
					class="rounded-full border px-5 py-2.5 text-sm font-semibold transition-all active:scale-95"
					style="border-color: {filter === c ? 'var(--accent-grass)' : 'var(--border-subtle)'}; color: {filter === c
						? 'var(--bg-deep)'
						: 'var(--text-muted)'}; background: {filter === c
						? 'linear-gradient(135deg, var(--accent-grass), var(--accent-grass-dim))'
						: 'transparent'}; box-shadow: {filter === c ? '0 0 24px var(--glow-grass)' : 'none'}"
					onclick={() => setFilter(c)}
					aria-pressed={filter === c}
				>
					{c === 'all' ? 'All' : c === 'fullstack' ? 'Full-stack' : c[0].toUpperCase() + c.slice(1)}
				</button>
			{/each}
		</div>

		<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
			{#each filtered as p (p.slug)}
				<button
					type="button"
					data-project-card
					class="interactive-card group text-left"
					style="border-color: var(--border-subtle); background: var(--bg-card); border-radius: var(--radius-xl); border-width: 1px; border-style: solid; transform-style: preserve-3d"
					onmousemove={(e) => tilt(e, e.currentTarget)}
					onmouseleave={(e) => resetTilt(e.currentTarget)}
					onclick={() => (modal = p)}
				>
					<div
						class="aspect-video overflow-hidden rounded-t-xl bg-black/30"
						style="box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--border-subtle) 80%, transparent)"
					>
						<img
							src={p.image}
							alt=""
							class="h-full w-full object-cover opacity-90 transition duration-500 ease-out group-hover:scale-110 group-hover:opacity-100"
						/>
					</div>
					<div class="p-5">
						<p class="font-heading text-accent-honey text-xs font-semibold uppercase">{p.category}</p>
						<h3 class="font-display mt-1 text-xl font-bold tracking-tight" style="color: var(--text-primary)">
							{p.title}
						</h3>
						<p class="font-body mt-2 text-sm leading-relaxed" style="color: var(--text-muted)">{p.blurb}</p>
						<p
							class="font-heading mt-4 inline-flex items-center gap-1 text-xs font-semibold tracking-wide uppercase"
							style="color: var(--accent-grass)"
						>
							Open case study
							<ArrowRight size={14} />
						</p>
					</div>
				</button>
			{/each}
		</div>
	</div>
</section>

{#if modal}
	<div
		class="fixed inset-0 z-[120] flex items-end justify-center p-4 sm:items-center"
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
	>
		<button
			bind:this={backdropEl}
			type="button"
			class="absolute inset-0 bg-black/70 backdrop-blur-md"
			style="opacity: 0"
			aria-label="Close"
			onclick={closeModal}
		></button>
		<div
			bind:this={panelEl}
			class="border-border-subtle relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border p-6 shadow-2xl"
			style="border-color: color-mix(in srgb, var(--accent-grass) 35%, var(--border-subtle)); background: var(--bg-elevated); box-shadow: 0 0 0 1px color-mix(in srgb, var(--accent-grass) 20%, transparent), 0 40px 80px -20px rgb(0 0 0 / 0.55); opacity: 0"
		>
			<button
				type="button"
				class="font-body absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border transition hover:scale-110"
				style="border-color: var(--border-subtle); color: var(--text-muted); background: var(--bg-card)"
				onclick={closeModal}
				aria-label="Close"
			>
				<X size={20} />
			</button>
			<img src={modal.image} alt="" class="mb-4 max-h-52 w-full rounded-xl object-cover shadow-lg" />
			<p class="font-heading text-accent-honey text-xs font-semibold uppercase">{modal.category}</p>
			<h2 id="modal-title" class="font-display mt-1 text-3xl font-extrabold" style="color: var(--text-primary)">
				{modal.title}
			</h2>
			<p class="font-body mt-4 leading-relaxed" style="color: var(--text-muted)">{modal.description}</p>
			<div class="mt-4 flex flex-wrap gap-2">
				{#each modal.stack as t, i (`${modal.slug}-${i}`)}
					<span
						class="rounded-full px-3 py-1 text-xs font-medium"
						style="background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border-subtle)"
					>
						{t}
					</span>
				{/each}
			</div>
			<div class="mt-6 flex flex-wrap gap-3">
				{#if modal.liveUrl}
					<a
						href={modal.liveUrl}
						class="rounded-full px-6 py-2.5 text-sm font-bold transition hover:brightness-110"
						style="background: linear-gradient(135deg, var(--accent-grass), var(--accent-grass-dim)); color: var(--bg-deep)"
						target="_blank"
						rel="noopener noreferrer external"
					>
						Live site
					</a>
				{/if}
				{#if modal.repoUrl}
					<a
						href={modal.repoUrl}
						class="rounded-full border px-6 py-2.5 text-sm font-semibold transition hover:border-[var(--accent-grass)]"
						style="border-color: var(--border-subtle); color: var(--text-primary)"
						target="_blank"
						rel="noopener noreferrer external"
					>
						Source
					</a>
				{/if}
			</div>
		</div>
	</div>
{/if}
