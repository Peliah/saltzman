<script lang="ts">
	import { SITE } from '$lib/portfolio/config';

	let open = $state(false);
	let input = $state('');
	let messages = $state<{ role: 'user' | 'assistant'; text: string }[]>([]);
	let streaming = $state(false);
	let typing = $state(false);

	const starters = [
		"What's your strongest skill?",
		'Are you open to work?',
		'Tell me about your best project'
	];

	async function send(text: string) {
		const t = text.trim();
		if (!t || streaming) return;
		messages = [...messages, { role: 'user', text: t }];
		const payload = messages.map((m) => ({ role: m.role, content: m.text }));
		messages = [...messages, { role: 'assistant', text: '' }];
		const idx = messages.length - 1;
		input = '';
		streaming = true;
		typing = true;

		try {
			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					messages: payload
				})
			});
			if (!res.ok || !res.body) {
				let errText = 'Chat request failed.';
				try {
					const errJson = (await res.json()) as { error?: string };
					if (errJson.error) errText = errJson.error;
				} catch {
					if (res.status === 503) {
						errText =
							'Chat is offline. Set OPENROUTER_API_KEY in `.env` and restart `pnpm dev`.';
					}
				}
				messages[idx] = { role: 'assistant', text: errText };
				streaming = false;
				typing = false;
				return;
			}
			typing = false;
			const reader = res.body.getReader();
			const dec = new TextDecoder();
			let buf = '';
			while (true) {
				const { value, done } = await reader.read();
				if (done) break;
				buf += dec.decode(value, { stream: true });
				const lines = buf.split('\n');
				buf = lines.pop() ?? '';
				for (const line of lines) {
					const s = line.replace(/^data:\s*/, '').trim();
					if (!s || s === '[DONE]') continue;
					try {
						const json = JSON.parse(s) as {
							choices?: { delta?: { content?: string } }[];
						};
						const piece = json.choices?.[0]?.delta?.content ?? '';
						if (piece) {
							messages[idx] = {
								role: 'assistant',
								text: (messages[idx]?.text ?? '') + piece
							};
							messages = [...messages];
						}
					} catch {
						/* ignore partial JSON */
					}
				}
			}
		} catch {
			messages[idx] = { role: 'assistant', text: 'Network error.' };
		} finally {
			streaming = false;
			typing = false;
		}
	}
</script>

<div class="pointer-events-none fixed bottom-4 left-4 z-[88] md:bottom-6 md:left-6">
	{#if open}
		<div
			class="pointer-events-auto mb-2 flex max-h-[min(70vh,520px)] w-[min(100vw-2rem,380px)] flex-col rounded-2xl border shadow-2xl"
			style="border-color: var(--border-subtle); background: var(--bg-elevated)"
		>
			<div
				class="border-border-subtle flex items-center justify-between border-b px-4 py-3"
				style="border-color: var(--border-subtle)"
			>
				<p class="font-heading text-sm" style="color: var(--text-primary)">Ask {SITE.name.split(' ')[0]}</p>
				<button
					type="button"
					class="text-lg leading-none"
					style="color: var(--text-muted)"
					onclick={() => (open = false)}
					aria-label="Close chat"
				>
					×
				</button>
			</div>
			<div class="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
				{#each messages as m, i (i)}
					<div
						class="max-w-[90%] rounded-xl px-3 py-2 text-sm {m.role === 'user'
							? 'self-end'
							: 'self-start'}"
						style={m.role === 'user'
							? 'background: var(--accent-grass); color: var(--bg-deep)'
							: 'background: var(--bg-card); color: var(--text-primary)'}
					>
						{m.text || (typing && i === messages.length - 1 ? '…' : '')}
					</div>
				{/each}
				{#if typing && messages[messages.length - 1]?.role === 'assistant' && !messages[messages.length - 1]?.text}
					<div class="font-body flex gap-1 text-xs" style="color: var(--text-muted)">
						<span class="animate-bounce">●</span>
						<span class="animate-bounce" style="animation-delay: 0.1s">●</span>
						<span class="animate-bounce" style="animation-delay: 0.2s">●</span>
					</div>
				{/if}
			</div>
			<div class="border-border-subtle flex flex-wrap gap-2 border-t p-3" style="border-color: var(--border-subtle)">
				{#each starters as s}
					<button
						type="button"
						class="rounded-full border px-3 py-1 text-xs"
						style="border-color: var(--border-subtle); color: var(--text-muted)"
						onclick={() => send(s)}
					>
						{s}
					</button>
				{/each}
			</div>
			<form
				class="border-border-subtle flex gap-2 border-t p-3"
				style="border-color: var(--border-subtle)"
				onsubmit={(e) => {
					e.preventDefault();
					void send(input);
				}}
			>
				<input
					class="flex-1 rounded-lg border px-3 py-2 text-sm"
					style="border-color: var(--border-subtle); background: var(--bg-deep); color: var(--text-primary)"
					bind:value={input}
					placeholder="Ask anything…"
					disabled={streaming}
				/>
				<button
					type="submit"
					class="rounded-full px-4 py-2 text-sm font-semibold disabled:opacity-50"
					style="background: var(--accent-grass); color: var(--bg-deep)"
					disabled={streaming}
				>
					Send
				</button>
			</form>
		</div>
	{/if}
	<button
		type="button"
		class="pointer-events-auto relative flex h-14 w-14 items-center justify-center rounded-full border-2 text-2xl shadow-lg"
		style="border-color: var(--accent-grass); background: var(--bg-elevated)"
		onclick={() => (open = !open)}
		aria-expanded={open}
		aria-label="Open chat"
	>
		💬
		<span
			class="absolute inset-0 rounded-full border-2 border-[var(--accent-honey)] opacity-40 animate-ping pointer-events-none"
			aria-hidden="true"
		></span>
	</button>
</div>
