<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setupConvex } from 'convex-svelte';

	let { url, children }: { url: string; children: Snippet } = $props();
	// Must run synchronously so SSR child components (e.g. GuestBook) see Convex context.
	// `url` comes from server load and is stable for the request.
	// svelte-ignore state_referenced_locally
	setupConvex(url);
</script>

{@render children()}
