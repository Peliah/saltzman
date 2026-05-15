<script lang="ts">
	import { confetti } from '@neoconfetti/svelte';
	import { api } from '$convex/_generated/api.js';
	import type { Id } from '$convex/_generated/dataModel';
	import { useConvexClient, useQuery } from 'convex-svelte';

	const q = useQuery(api.guestbook.list, {});
	const client = useConvexClient();

	let name = $state('');
	let message = $state('');
	let mood = $state('happy');
	const moods = [
		{ id: 'happy', emoji: '😊' },
		{ id: 'cool', emoji: '😎' },
		{ id: 'love', emoji: '😍' },
		{ id: 'think', emoji: '🤔' },
		{ id: 'sleep', emoji: '😴' }
	] as const;

	let board: HTMLDivElement | undefined;
	let error = $state<string | null>(null);
	let submitting = $state(false);

	async function submit(e: Event) {
		e.preventDefault();
		error = null;
		submitting = true;
		try {
			await client.mutation(api.guestbook.post, { name, message, mood });
			name = '';
			message = '';
			if (board) confetti(board, { particleCount: 40, force: 0.35 });
		} catch (err) {
			error = err instanceof Error ? err.message : 'Could not post';
		} finally {
			submitting = false;
		}
	}

	async function react(id: Id<'guestbookMessages'>, kind: 'heart' | 'fire' | 'clap' | 'laugh') {
		try {
			await client.mutation(api.guestbook.react, { id, kind });
		} catch {
			/* ignore */
		}
	}

	function cardTilt(e: MouseEvent, el: HTMLElement) {
		const rot = Number(el.dataset.rot ?? '0');
		const r = el.getBoundingClientRect();
		const x = e.clientX - r.left - r.width / 2;
		const y = e.clientY - r.top - r.height / 2;
		el.style.transform = `perspective(900px) rotate(${rot}deg) rotateX(${y * -0.035}deg) rotateY(${x * 0.045}deg) translateY(-3px)`;
	}
	function cardReset(el: HTMLElement) {
		const rot = Number(el.dataset.rot ?? '0');
		el.style.transform = `perspective(900px) rotate(${rot}deg)`;
	}
</script>

<section class="cork-board section-inner relative overflow-hidden py-28" id="guestbook">
	<div
		class="pointer-events-none absolute inset-0 opacity-30 mix-blend-soft-light"
		style="background: radial-gradient(ellipse 80% 50% at 50% -10%, var(--accent-honey), transparent 55%)"
		aria-hidden="true"
	></div>

	<div bind:this={board} class="relative mx-auto max-w-6xl px-4">
		<p class="font-heading text-accent-honey mb-2 text-xs font-semibold tracking-[0.2em] uppercase">
			Realtime wall
		</p>
		<h2 class="font-display text-gradient-title mb-4 text-4xl font-extrabold md:text-6xl">Guest book</h2>
		<p class="font-body mb-10 max-w-2xl text-lg leading-relaxed" style="color: var(--text-muted)">
			Pin a note, pick a mood, nudge reactions — updates live for everyone when Convex is running.
		</p>

		<form
			class="form-glow interactive-card mb-12 max-w-xl rounded-2xl border p-6"
			style="border-color: var(--border-subtle); background: color-mix(in srgb, var(--bg-card) 92%, transparent)"
			onsubmit={submit}
		>
			<label
				for="gb-name"
				class="font-body mb-2 block text-sm"
				style="color: var(--text-muted)"
			>
				Name
			</label>
			<input
				id="gb-name"
				class="mb-4 w-full rounded-lg border px-3 py-2 transition"
				style="border-color: var(--border-subtle); background: var(--bg-elevated); color: var(--text-primary)"
				bind:value={name}
				maxlength={80}
				required
			/>
			<label
				for="gb-message"
				class="font-body mb-2 block text-sm"
				style="color: var(--text-muted)"
			>
				Message
			</label>
			<textarea
				id="gb-message"
				class="mb-4 min-h-[100px] w-full rounded-lg border px-3 py-2 transition"
				style="border-color: var(--border-subtle); background: var(--bg-elevated); color: var(--text-primary)"
				bind:value={message}
				maxlength={500}
				required
			></textarea>
			<fieldset class="mb-4">
				<legend class="font-body mb-2 text-sm" style="color: var(--text-muted)">Mood</legend>
				<div class="flex flex-wrap gap-2">
					{#each moods as m}
						<button
							type="button"
							class="rounded-full border px-4 py-2 text-lg transition-all active:scale-95"
							style="border-color: {mood === m.id ? 'var(--accent-grass)' : 'var(--border-subtle)'}; background: {mood === m.id
								? 'color-mix(in srgb, var(--accent-grass) 22%, transparent)'
								: 'transparent'}; box-shadow: {mood === m.id ? '0 0 20px var(--glow-grass)' : 'none'}"
							onclick={() => (mood = m.id)}
							aria-pressed={mood === m.id}
						>
							{m.emoji}
						</button>
					{/each}
				</div>
			</fieldset>
			{#if error}
				<p class="font-body mb-2 text-sm text-red-400">{error}</p>
			{/if}
			<button
				type="submit"
				class="font-heading w-full rounded-full px-6 py-3 text-sm font-bold tracking-wide transition hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
				style="background: linear-gradient(135deg, var(--accent-grass), var(--accent-grass-dim)); color: var(--bg-deep)"
				disabled={submitting}
			>
				{submitting ? 'Pinning…' : 'Pin to corkboard'}
			</button>
		</form>

		{#if q.isLoading}
			<p class="font-body animate-pulse" style="color: var(--text-muted)">Unrolling thread…</p>
		{:else if q.error}
			<p class="font-body text-red-400">{String(q.error)}</p>
		{:else if q.data}
			<div class="columns-1 gap-6 sm:columns-2 lg:columns-3">
				{#each q.data.messages as card, i (card._id)}
					{@const rot = ((card._id as string).charCodeAt(3) % 7) - 3}
					<div
						class="animate-card-in mb-6 break-inside-avoid"
						style="animation-delay: {Math.min(i, 20) * 0.05}s"
					>
						<div
							class="guest-cork-card group relative rounded-xl border p-5 pt-8 shadow-lg"
							style="border-color: var(--border-subtle); background: linear-gradient(165deg, color-mix(in srgb, var(--bg-card) 94%, #fff 6%) 0%, var(--bg-card) 100%); transform: perspective(900px) rotate({rot}deg)"
							data-rot={String(rot)}
							role="article"
							aria-label="Guest note from {card.name}"
							onmousemove={(e) => cardTilt(e, e.currentTarget)}
							onmouseleave={(e) => cardReset(e.currentTarget)}
						>
						<div
							class="pointer-events-none absolute -top-3 left-1/2 flex -translate-x-1/2 drop-shadow-md"
							aria-hidden="true"
						>
							<svg width="28" height="36" viewBox="0 0 28 36" fill="none">
								<ellipse cx="14" cy="10" rx="8" ry="7" fill="var(--accent-terracotta)" />
								<path
									d="M14 17v15l4-6h-8l4-6Z"
									fill="var(--accent-honey)"
									stroke="color-mix(in srgb, var(--border-subtle) 60%, transparent)"
									stroke-width="0.5"
								/>
							</svg>
						</div>
						{#if q.data.featuredId === card._id}
							<span
								class="font-heading mb-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold"
								style="background: linear-gradient(90deg, var(--accent-honey), var(--accent-terracotta)); color: var(--bg-deep)"
							>
								★ Featured
							</span>
						{/if}
						<div class="mb-2 flex items-center gap-2">
							<span class="text-2xl transition-transform duration-300 group-hover:scale-110"
								>{moods.find((x) => x.id === card.mood)?.emoji ?? '🙂'}</span
							>
							<span class="font-display text-lg font-bold" style="color: var(--text-primary)">{card.name}</span>
						</div>
						<p class="font-body text-sm leading-relaxed whitespace-pre-wrap" style="color: var(--text-muted)">
							{card.message}
						</p>
						<div class="mt-4 flex flex-wrap gap-2 text-sm">
							<button
								type="button"
								class="reaction-pill rounded-full border px-3 py-1 font-medium"
								style="border-color: var(--border-subtle); color: var(--text-primary)"
								onclick={() => react(card._id, 'heart')}
							>
								❤️ {card.reactions.heart}
							</button>
							<button
								type="button"
								class="reaction-pill rounded-full border px-3 py-1 font-medium"
								style="border-color: var(--border-subtle); color: var(--text-primary)"
								onclick={() => react(card._id, 'fire')}
							>
								🔥 {card.reactions.fire}
							</button>
							<button
								type="button"
								class="reaction-pill rounded-full border px-3 py-1 font-medium"
								style="border-color: var(--border-subtle); color: var(--text-primary)"
								onclick={() => react(card._id, 'clap')}
							>
								👏 {card.reactions.clap}
							</button>
							<button
								type="button"
								class="reaction-pill rounded-full border px-3 py-1 font-medium"
								style="border-color: var(--border-subtle); color: var(--text-primary)"
								onclick={() => react(card._id, 'laugh')}
							>
								😂 {card.reactions.laugh}
							</button>
						</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>
