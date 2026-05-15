<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setupConvex } from 'convex-svelte';

	const props: { url: string; children: Snippet } = $props();
	// Must run synchronously so SSR child components (e.g. GuestBook) see Convex context.
	// `url` comes from server load and is stable for the request.
	setupConvex(props.url);
</script>

{@render props.children()}
