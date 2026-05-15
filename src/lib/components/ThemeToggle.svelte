<script lang="ts">
	import { Moon, Sun } from '@lucide/svelte';
	import { theme, toggleTheme, applyThemeClass } from '$lib/stores/theme.svelte';

	function onToggle() {
		toggleTheme();
		applyThemeClass();
	}
</script>

<button
	type="button"
	class="border-border-subtle bg-bg-elevated text-text-primary hover:border-accent-grass fixed top-4 right-4 z-[90] flex h-11 w-11 items-center justify-center rounded-full border shadow-lg transition-colors"
	style="border-color: var(--border-subtle); background: var(--bg-elevated); color: var(--text-primary)"
	onclick={onToggle}
	aria-label={theme.mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
>
	{#if theme.mode === 'dark'}
		<Sun size={20} strokeWidth={2} />
	{:else}
		<Moon size={20} strokeWidth={2} />
	{/if}
</button>
