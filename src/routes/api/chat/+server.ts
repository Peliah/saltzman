import { env } from '$env/dynamic/private';
import { CHAT_SYSTEM_PROMPT } from '$lib/portfolio/config';
import type { RequestHandler } from './$types';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const ALLOWED_MODELS = new Set([
	'anthropic/claude-3.5-haiku',
	'anthropic/claude-3.5-sonnet',
	'openai/gpt-4o-mini',
	'google/gemini-flash-1.5'
]);

function pickModel(requested: string | undefined): string {
	const fromEnv = env.OPENROUTER_MODEL?.trim();
	if (fromEnv && ALLOWED_MODELS.has(fromEnv)) return fromEnv;
	if (requested && ALLOWED_MODELS.has(requested)) return requested;
	return 'anthropic/claude-3.5-haiku';
}

export const POST: RequestHandler = async ({ request, fetch }) => {
	const OPENROUTER_API_KEY = env.OPENROUTER_API_KEY;
	if (!OPENROUTER_API_KEY) {
		return new Response(JSON.stringify({ error: 'OPENROUTER_API_KEY is not configured.' }), {
			status: 503,
			headers: { 'content-type': 'application/json' }
		});
	}

	let body: { messages?: { role: string; content: string }[]; model?: string };
	try {
		body = await request.json();
	} catch {
		return new Response(JSON.stringify({ error: 'Invalid JSON body.' }), { status: 400 });
	}

	const messages = body.messages;
	if (!Array.isArray(messages) || messages.length === 0 || messages.length > 30) {
		return new Response(JSON.stringify({ error: 'messages must be a non-empty array (max 30).' }), {
			status: 400
		});
	}

	const model = pickModel(typeof body.model === 'string' ? body.model : undefined);

	const upstream = await fetch(OPENROUTER_URL, {
		method: 'POST',
		headers: {
			authorization: `Bearer ${OPENROUTER_API_KEY}`,
			'content-type': 'application/json',
			Accept: 'text/event-stream',
			'HTTP-Referer': env.OPENROUTER_HTTP_REFERER || 'http://localhost:5173',
			'X-Title': env.OPENROUTER_APP_NAME || 'Portfolio chat'
		},
		body: JSON.stringify({
			model,
			stream: true,
			max_tokens: 512,
			messages: [{ role: 'system', content: CHAT_SYSTEM_PROMPT }, ...messages]
		})
	});

	if (!upstream.ok || !upstream.body) {
		const errText = await upstream.text().catch(() => '');
		let message = 'OpenRouter request failed.';
		try {
			const parsed = JSON.parse(errText) as {
				error?: { message?: string };
			};
			if (parsed.error?.message) message = parsed.error.message;
		} catch {
			/* use default */
		}
		if (upstream.status === 402) {
			message =
				'OpenRouter account needs credits (or a lower max_tokens). Add credits at openrouter.ai/settings/credits.';
		}
		return new Response(JSON.stringify({ error: message, detail: errText.slice(0, 500) }), {
			status: upstream.status || 502,
			headers: { 'content-type': 'application/json' }
		});
	}

	return new Response(upstream.body, {
		headers: {
			'content-type': 'text/event-stream; charset=utf-8',
			'cache-control': 'no-cache',
			connection: 'keep-alive'
		}
	});
};
