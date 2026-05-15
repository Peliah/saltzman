<script lang="ts">
	import emailjs from '@emailjs/browser';
	import { confetti } from '@neoconfetti/svelte';
	import { env } from '$env/dynamic/public';
	import { SITE } from '$lib/portfolio/config';

	let name = $state('');
	let email = $state('');
	let body = $state('');
	let hp = $state('');
	let status = $state<'idle' | 'sending' | 'sent' | 'err'>('idle');
	let err = $state('');
	let host: HTMLDivElement | undefined;

	const configured = $derived(
		Boolean(
			env.PUBLIC_EMAILJS_SERVICE_ID &&
				env.PUBLIC_EMAILJS_TEMPLATE_ID &&
				env.PUBLIC_EMAILJS_PUBLIC_KEY
		)
	);

	async function submit(e: Event) {
		e.preventDefault();
		if (hp) return;
		err = '';
		if (!configured) {
			err = 'Add EmailJS keys to .env (see .env.example).';
			return;
		}
		status = 'sending';
		try {
			await emailjs.send(
				env.PUBLIC_EMAILJS_SERVICE_ID!,
				env.PUBLIC_EMAILJS_TEMPLATE_ID!,
				{ from_name: name, reply_to: email, message: body, to_name: SITE.name },
				{ publicKey: env.PUBLIC_EMAILJS_PUBLIC_KEY! }
			);
			status = 'sent';
			if (host) confetti(host, { particleCount: 50, force: 0.35 });
		} catch {
			status = 'err';
			err = 'Could not send — try again or email directly.';
		}
	}
</script>

<section class="section-inner relative overflow-hidden py-28" style="background: var(--bg-elevated)" id="contact">
	<div
		class="pointer-events-none absolute inset-0 opacity-25"
		style="background: radial-gradient(ellipse 70% 55% at 80% 20%, var(--accent-honey), transparent 50%), radial-gradient(ellipse 50% 40% at 10% 80%, var(--accent-grass), transparent 45%)"
		aria-hidden="true"
	></div>

	<div bind:this={host} class="relative mx-auto max-w-xl px-4">
		<p class="font-heading text-accent-honey mb-2 text-xs font-semibold tracking-[0.2em] uppercase">
			Reach out
		</p>
		<h2 class="font-display text-gradient-title mb-4 text-4xl font-extrabold md:text-5xl">Contact</h2>
		<p class="font-body mb-10 text-lg leading-relaxed" style="color: var(--text-muted)">
			Floating labels, honeypot, and EmailJS when keys are set — focus the form and the edges warm up.
		</p>

		{#if status === 'sent'}
			<div
				class="interactive-card animate-card-in rounded-2xl border px-6 py-10 text-center"
				style="border-color: var(--accent-grass); background: var(--bg-card)"
			>
				<p class="font-display text-2xl font-bold text-[var(--accent-grass)]">Message sent ✓</p>
				<p class="font-body mt-2 text-sm" style="color: var(--text-muted)">Thanks — I'll get back to you.</p>
			</div>
		{:else}
			<form
				class="form-glow interactive-card space-y-6 rounded-2xl border p-6 {err ? 'shake-once' : ''}"
				style="border-color: var(--border-subtle); background: var(--bg-card)"
				onsubmit={submit}
			>
				<input class="hidden" tabindex="-1" autocomplete="off" bind:value={hp} aria-hidden="true" />
				<div class="relative">
					<input
						id="cname"
						class="peer w-full rounded-lg border px-3 pt-6 pb-2 transition focus:outline-none focus:ring-2 focus:ring-[var(--accent-grass)]/35"
						style="border-color: var(--border-subtle); background: var(--bg-elevated); color: var(--text-primary)"
						bind:value={name}
						placeholder=" "
						required
					/>
					<label
						for="cname"
						class="pointer-events-none absolute left-3 transition-all peer-placeholder-shown:top-3 peer-focus:top-1 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs"
						style="color: var(--text-muted); top: 0.35rem"
					>
						Name
					</label>
				</div>
				<div class="relative">
					<input
						id="cemail"
						type="email"
						class="peer w-full rounded-lg border px-3 pt-6 pb-2 transition focus:outline-none focus:ring-2 focus:ring-[var(--accent-grass)]/35"
						style="border-color: var(--border-subtle); background: var(--bg-elevated); color: var(--text-primary)"
						bind:value={email}
						placeholder=" "
						required
					/>
					<label
						for="cemail"
						class="pointer-events-none absolute left-3 text-sm transition-all peer-placeholder-shown:top-3 peer-focus:top-1 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs"
						style="color: var(--text-muted); top: 0.35rem"
					>
						Email
					</label>
				</div>
				<div class="relative">
					<textarea
						id="cbody"
						class="peer min-h-[120px] w-full rounded-lg border px-3 pt-7 pb-2 transition focus:outline-none focus:ring-2 focus:ring-[var(--accent-grass)]/35"
						style="border-color: var(--border-subtle); background: var(--bg-elevated); color: var(--text-primary)"
						bind:value={body}
						placeholder=" "
						required
					></textarea>
					<label
						for="cbody"
						class="pointer-events-none absolute left-3 text-sm transition-all peer-placeholder-shown:top-3 peer-focus:top-1 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs"
						style="color: var(--text-muted); top: 0.45rem"
					>
						Message
					</label>
				</div>
				{#if err}
					<p class="font-body text-sm text-red-400">{err}</p>
				{/if}
				<button
					type="submit"
					class="font-heading w-full rounded-full py-3 text-sm font-bold tracking-wide transition hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
					style="background: linear-gradient(135deg, var(--accent-grass), var(--accent-grass-dim)); color: var(--bg-deep)"
					disabled={status === 'sending'}
				>
					{status === 'sending' ? 'Sending…' : 'Send message'}
				</button>
			</form>
		{/if}
	</div>
</section>
