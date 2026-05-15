<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import Hero from '$lib/components/Hero.svelte';
	import About from '$lib/components/About.svelte';
	import Projects from '$lib/components/Projects.svelte';
	import MiniGame from '$lib/components/MiniGame.svelte';
	import GuestBook from '$lib/components/GuestBook.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import PortfolioNav from '$lib/components/PortfolioNav.svelte';
	import { game } from '$lib/stores/game.svelte';
	import { portfolio, initPortfolioViewFromHash } from '$lib/stores/portfolio-view.svelte';
	import { SITE } from '$lib/portfolio/config';

	onMount(() => initPortfolioViewFromHash());
</script>

<svelte:head>
	<title>{SITE.name} — Portfolio</title>
	<meta name="description" content={SITE.tagline} />
</svelte:head>

<div
	class="flex h-dvh min-h-0 w-full flex-col overflow-hidden md:flex-row"
	style="background: var(--bg-deep)"
>
	<PortfolioNav />
	<main
		id="portfolio-scroll-main"
		class="thin-scrollbar min-h-0 flex-1 overflow-x-hidden overflow-y-auto scroll-smooth pb-8"
	>
		{#if portfolio.view === 'home'}
			<Hero />
		{:else if portfolio.view === 'about'}
			<div class="section-appear" id="about">
				<About />
			</div>
		{:else if portfolio.view === 'projects'}
			<div class="section-appear" id="projects">
				<Projects />
			</div>
		{:else if portfolio.view === 'game'}
			<div class="section-appear" id="game">
				<MiniGame />
			</div>
		{:else if portfolio.view === 'guestbook'}
			<div class="section-appear" id="guestbook">
				{#if page.data.hasConvex}
					<GuestBook />
				{:else}
					<section class="cork-board section-inner relative overflow-hidden py-24">
						<div
							class="pointer-events-none absolute inset-0 opacity-20"
							style="background: radial-gradient(circle at 50% 0%, var(--accent-honey), transparent 55%)"
							aria-hidden="true"
						></div>
						<div class="relative mx-auto max-w-2xl px-4 text-center">
							<p class="font-heading text-accent-honey mb-2 text-xs font-semibold tracking-[0.2em] uppercase">
								Offline preview
							</p>
							<h2 class="font-display text-gradient-title mb-4 text-3xl font-extrabold md:text-4xl">
								Guest book
							</h2>
							<div
								class="interactive-card mx-auto mt-6 max-w-lg rounded-2xl border p-8"
								style="border-color: var(--border-subtle); background: color-mix(in srgb, var(--bg-card) 94%, transparent)"
							>
								<p class="font-body leading-relaxed" style="color: var(--text-muted)">
									Set <code class="font-mono text-[var(--accent-grass)]">PUBLIC_CONVEX_URL</code> in
									<code class="font-mono text-[var(--accent-grass)]">.env</code> and run
									<code class="font-mono text-[var(--accent-grass)]">pnpm exec convex dev</code> to enable the
									realtime corkboard with pins, moods, and reactions.
								</p>
							</div>
						</div>
					</section>
				{/if}
			</div>
		{:else if portfolio.view === 'contact'}
			<div class="section-appear" id="contact">
				<Contact />
			</div>
		{:else if portfolio.view === 'hire' && game.hireUnlocked}
			<section
				class="section-inner section-appear relative overflow-hidden py-20"
				style="background: linear-gradient(180deg, var(--bg-card), var(--bg-deep))"
				id="hire"
			>
				<div
					class="pointer-events-none absolute inset-0 opacity-30"
					style="background: radial-gradient(ellipse 60% 80% at 50% 100%, var(--glow-grass), transparent 70%)"
					aria-hidden="true"
				></div>
				<div class="relative mx-auto max-w-2xl px-4 text-center">
					<p class="font-heading text-accent-honey text-xs font-semibold tracking-[0.25em] uppercase">
						Easter egg
					</p>
					<h2 class="font-display text-gradient-title mt-3 text-4xl font-extrabold md:text-5xl">Hire me</h2>
					<p class="font-body mt-6 text-lg leading-relaxed" style="color: var(--text-muted)">
						You cleared three Bug Squash waves — thanks for playing. If you liked this energy, let's build
						something together. Use the contact form or your favorite DM.
					</p>
				</div>
			</section>
		{:else}
			<Hero />
		{/if}
	</main>
</div>

<style>
	.section-appear {
		animation: section-in 0.45s ease-out;
	}

	@keyframes section-in {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.section-appear {
			animation: none;
		}
	}

	.thin-scrollbar {
		scrollbar-gutter: stable;
	}
</style>
