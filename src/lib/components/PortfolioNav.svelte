<script lang="ts">
	import { House, UserRound, FolderKanban, Gamepad2, BookHeart, Mail, Briefcase } from '@lucide/svelte';
	import { game } from '$lib/stores/game.svelte';
	import { portfolio, setPortfolioView, type PortfolioView } from '$lib/stores/portfolio-view.svelte';

	type NavItem = { id: PortfolioView; label: string; icon: typeof House; show?: boolean };

	const items = $derived.by((): NavItem[] => {
		return [
			{ id: 'home', label: 'Home', icon: House },
			{ id: 'about', label: 'About', icon: UserRound },
			{ id: 'projects', label: 'Work', icon: FolderKanban },
			{ id: 'game', label: 'Play', icon: Gamepad2 },
			{ id: 'guestbook', label: 'Wall', icon: BookHeart },
			{ id: 'contact', label: 'Contact', icon: Mail },
			{ id: 'hire', label: 'Hire', icon: Briefcase, show: game.hireUnlocked }
		].filter((i) => i.show !== false) as NavItem[];
	});

	function go(id: PortfolioView) {
		setPortfolioView(id);
	}
</script>

<nav
	class="border-border-subtle flex h-auto shrink-0 flex-col border-b md:h-full md:w-[min(15rem,28vw)] md:min-h-0 md:self-stretch md:border-b-0 md:border-r"
	style="border-color: var(--border-subtle); background: color-mix(in srgb, var(--bg-elevated) 92%, transparent)"
	aria-label="Portfolio sections"
>
	<div class="font-heading hidden px-4 pt-5 pb-2 text-[10px] tracking-[0.2em] text-[var(--text-muted)] uppercase md:block">
		Navigate
	</div>
	<ul class="flex flex-row gap-1 overflow-x-auto px-2 py-2 md:flex-col md:gap-0 md:px-3 md:py-4">
		{#each items as item (item.id)}
			{@const Icon = item.icon}
			<li class="shrink-0">
				<button
					type="button"
					class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition md:py-3"
					class:active={portfolio.view === item.id}
					onclick={() => go(item.id)}
					aria-current={portfolio.view === item.id ? 'page' : undefined}
				>
					<Icon
						class="h-5 w-5 shrink-0 opacity-80"
						strokeWidth={portfolio.view === item.id ? 2.25 : 1.75}
					/>
					<span class="hidden md:inline">{item.label}</span>
				</button>
			</li>
		{/each}
	</ul>
</nav>

<style>
	button.active {
		background: color-mix(in srgb, var(--accent-grass) 18%, transparent);
		color: var(--text-primary);
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent-grass) 45%, transparent);
	}
	button:not(.active) {
		color: var(--text-muted);
	}
	button:not(.active):hover {
		background: color-mix(in srgb, var(--bg-card) 80%, transparent);
		color: var(--text-primary);
	}
</style>
