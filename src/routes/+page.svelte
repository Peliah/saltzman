<script lang="ts">
	import { page } from '$app/state';
	import Hero from '$lib/components/Hero.svelte';
	import About from '$lib/components/About.svelte';
	import Projects from '$lib/components/Projects.svelte';
	import MiniGame from '$lib/components/MiniGame.svelte';
	import GuestBook from '$lib/components/GuestBook.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import { game } from '$lib/stores/game.svelte';
	import { SITE } from '$lib/portfolio/config';
</script>

<svelte:head>
	<title>{SITE.name} — Portfolio</title>
	<meta name="description" content={SITE.tagline} />
</svelte:head>

<main class="pb-32">
	<Hero />
	<About />
	<Projects />
	<MiniGame />
	{#if page.data.hasConvex}
		<GuestBook />
	{:else}
		<section class="cork-board section-inner relative overflow-hidden py-24" id="guestbook">
			<div
				class="pointer-events-none absolute inset-0 opacity-20"
				style="background: radial-gradient(circle at 50% 0%, var(--accent-honey), transparent 55%)"
				aria-hidden="true"
			></div>
			<div class="relative mx-auto max-w-2xl px-4 text-center">
				<p class="font-heading text-accent-honey mb-2 text-xs font-semibold tracking-[0.2em] uppercase">
					Offline preview
				</p>
				<h2 class="font-display text-gradient-title mb-4 text-3xl font-extrabold md:text-4xl">Guest book</h2>
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
	{#if game.hireUnlocked}
		<section
			class="section-inner relative overflow-hidden py-20 duration-500"
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
	{/if}
	<Contact />
</main>
