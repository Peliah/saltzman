<script lang="ts">
	import type { Action } from 'svelte/action';
	import { confetti } from '@neoconfetti/svelte';
	import { registerRoundWin } from '$lib/stores/game.svelte';

	const ERRORS = [
		'TypeError: undefined is not a function',
		'ReferenceError: brain is not defined',
		'404: Motivation not found',
		'UnhandledPromiseRejectionWarning: sleep()'
	];

	const st = $state({
		score: 0,
		misses: 0,
		gameOver: false,
		round: 1,
		squashedInRound: 0,
		message: '',
		best: 0,
		unlockSent: false
	});

	let confettiHost: HTMLDivElement;
	let resetKey = $state(0);
	const STORAGE = 'saltzman-bug-high';
	const targetPerRound = 12;

	type Bug = { x: number; y: number; vy: number };

	function drawBug(ctx: CanvasRenderingContext2D, x: number, y: number, fill: string, eye: string) {
		ctx.save();
		ctx.translate(x, y);
		ctx.fillStyle = fill;
		ctx.beginPath();
		ctx.ellipse(0, 0, 11, 9, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.strokeStyle = fill;
		ctx.lineWidth = 1.5;
		ctx.lineCap = 'round';
		for (const [lx, ly] of [
			[-12, -5],
			[-12, 5],
			[12, -5],
			[12, 5],
			[-7, 9],
			[7, 9]
		]) {
			ctx.beginPath();
			ctx.moveTo(lx * 0.35, ly * 0.35);
			ctx.lineTo(lx, ly);
			ctx.stroke();
		}
		ctx.fillStyle = eye;
		ctx.beginPath();
		ctx.arc(-4, -2, 2.2, 0, Math.PI * 2);
		ctx.arc(4, -2, 2.2, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	const gameCanvas: Action<HTMLCanvasElement> = (canvas) => {
		st.score = 0;
		st.misses = 0;
		st.round = 1;
		st.squashedInRound = 0;
		st.gameOver = false;
		st.message = '';
		st.unlockSent = false;
		st.best = Number(localStorage.getItem(STORAGE) || '0') || 0;

		const ctx = canvas.getContext('2d');
		if (!ctx) return { destroy() {} };

		let bugs: Bug[] = [];
		let raf = 0;
		let last = performance.now();
		let pointerX = 0;

		const resize = () => {
			const rect = canvas.parentElement?.getBoundingClientRect();
			canvas.width = Math.min(720, rect?.width ?? 720);
			canvas.height = 360;
			pointerX = canvas.width / 2;
		};
		resize();
		window.addEventListener('resize', resize);

		const loop = () => {
			const now = performance.now();
			const dt = Math.min(32, now - last);
			last = now;

			const bg =
				getComputedStyle(document.documentElement).getPropertyValue('--bg-card').trim() || '#1c241c';
			ctx.fillStyle = bg;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.fillStyle =
				getComputedStyle(document.documentElement).getPropertyValue('--accent-grass') || '#6cbf6a';
			ctx.fillRect(pointerX - 40, canvas.height - 18, 80, 8);

			if (!st.gameOver && Math.random() < 0.018 + st.round * 0.004) {
				bugs.push({
					x: Math.random() * (canvas.width - 40) + 20,
					y: -20,
					vy: 1.1 + Math.random() * 1.4 + st.round * 0.12
				});
			}

			const alive: Bug[] = [];
			for (const b of bugs) {
				const ny = b.y + b.vy * (dt / 16);
				if (ny > canvas.height - 8) {
					st.misses += 1;
					st.message = ERRORS[Math.floor(Math.random() * ERRORS.length)] ?? 'Miss!';
					if (st.misses >= 5) st.gameOver = true;
				} else {
					alive.push({ ...b, y: ny });
				}
			}
			bugs = alive;

			const grass =
				getComputedStyle(document.documentElement).getPropertyValue('--accent-grass').trim() ||
				'#6cbf6a';
			const eye =
				getComputedStyle(document.documentElement).getPropertyValue('--bg-deep').trim() || '#0c100d';
			for (const b of bugs) {
				drawBug(ctx, b.x, b.y, grass, eye);
			}

			const muted =
				getComputedStyle(document.documentElement).getPropertyValue('--text-muted') || '#a3a89e';
			ctx.fillStyle = muted;
			ctx.font = '14px Sora, sans-serif';
			ctx.fillText(`Score ${st.score} · Misses ${st.misses}/5 · Round ${st.round}`, 12, 22);

			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);

		const onMove = (e: MouseEvent) => {
			const r = canvas.getBoundingClientRect();
			pointerX = e.clientX - r.left;
		};
		const onClick = () => {
			if (st.gameOver) return;
			let best: Bug | null = null;
			let bestD = Infinity;
			for (const b of bugs) {
				const d = Math.hypot(b.x - pointerX, b.y - (canvas.height - 36));
				if (d < 52 && d < bestD) {
					bestD = d;
					best = b;
				}
			}
			if (best) {
				bugs = bugs.filter((b) => b !== best);
				const storedBest = Number(localStorage.getItem(STORAGE) || '0') || 0;
				st.score += 1;
				st.message = ERRORS[Math.floor(Math.random() * ERRORS.length)] ?? 'Squashed!';
				st.squashedInRound += 1;
				if (st.squashedInRound >= targetPerRound) {
					st.squashedInRound = 0;
					st.round += 1;
					if (st.round >= 4 && !st.unlockSent) {
						st.unlockSent = true;
						registerRoundWin();
					}
				}
				if (st.score > storedBest && confettiHost) {
					confetti(confettiHost, { particleCount: 60, force: 0.4 });
				}
			} else {
				st.message = 'Click closer to the bug!';
			}
		};

		canvas.addEventListener('mousemove', onMove);
		canvas.addEventListener('click', onClick);

		return {
			destroy() {
				cancelAnimationFrame(raf);
				window.removeEventListener('resize', resize);
				canvas.removeEventListener('mousemove', onMove);
				canvas.removeEventListener('click', onClick);
			}
		};
	};

	$effect(() => {
		if (st.score > st.best) {
			st.best = st.score;
			localStorage.setItem(STORAGE, String(st.best));
		}
	});

	function playAgain() {
		resetKey += 1;
	}
</script>

<section class="section-inner relative overflow-hidden py-28" style="background: var(--bg-elevated)" id="game">
	<div bind:this={confettiHost} class="pointer-events-none fixed inset-0 z-[50]"></div>
	<div
		class="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full opacity-20 blur-3xl"
		style="background: var(--accent-grass)"
		aria-hidden="true"
	></div>
	<div
		class="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full opacity-15 blur-3xl"
		style="background: var(--accent-honey)"
		aria-hidden="true"
	></div>
	<div class="relative mx-auto max-w-3xl px-4">
		<p class="font-heading text-accent-honey mb-2 text-xs font-semibold tracking-[0.2em] uppercase">
			Micro-break
		</p>
		<h2 class="font-display text-gradient-title mb-4 text-4xl font-extrabold md:text-5xl">Bug Squash</h2>
		<p class="font-body mb-8 max-w-2xl text-lg leading-relaxed" style="color: var(--text-muted)">
			Steer with the mouse, click to squash. Five misses = game over. Beat three waves to unlock a surprise.
			High score: <strong style="color: var(--accent-honey)">{st.best}</strong>
		</p>
		{#key resetKey}
			<div class="interactive-card overflow-hidden rounded-xl">
				<canvas
					use:gameCanvas
					class="w-full cursor-crosshair border-0"
					style="background: var(--bg-card); display: block"
				></canvas>
			</div>
		{/key}
		{#if st.message}
			<p class="font-mono mt-3 text-sm" style="color: var(--accent-grass)">{st.message}</p>
		{/if}
		{#if st.gameOver}
			<button
				type="button"
				class="mt-4 rounded-full px-6 py-2 text-sm font-semibold"
				style="background: var(--accent-terracotta); color: var(--bg-deep)"
				onclick={playAgain}
			>
				Play again
			</button>
		{/if}
	</div>
</section>
