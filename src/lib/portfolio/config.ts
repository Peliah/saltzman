/** Site copy and portfolio content — edit for your profile */
export const SITE = {
	name: 'Saltzman',
	title: 'Full-stack engineer · Svelte & TypeScript',
	tagline: 'I build calm, fast web apps — and the systems behind them.',
	resumePath: '/resume.pdf'
} as const;

export type ProjectCategory = 'all' | 'frontend' | 'backend' | 'fullstack';

export type Project = {
	slug: string;
	title: string;
	category: Exclude<ProjectCategory, 'all'>;
	blurb: string;
	description: string;
	stack: string[];
	image: string;
	liveUrl?: string;
	repoUrl?: string;
};

export const PROJECTS: Project[] = [
	{
		slug: 'saltzman',
		title: 'This portfolio',
		category: 'fullstack',
		blurb: 'SvelteKit, GSAP, Convex, OpenRouter, lo-fi vibes.',
		description:
			'A cinematic single-page portfolio with realtime guest book, AI chat over your resume, and a tiny canvas game.',
		stack: ['SvelteKit', 'Convex', 'Tailwind', 'GSAP', 'Howler'],
		image: '/favicon.svg',
		repoUrl: 'https://github.com'
	},
	{
		slug: 'placeholder-ui',
		title: 'Design system UI',
		category: 'frontend',
		blurb: 'Accessible components with strict tokens.',
		description: 'Replace with a real project: routing, forms, and data visualization.',
		stack: ['Svelte', 'TypeScript', 'Tailwind'],
		image: '/favicon.svg',
		liveUrl: 'https://svelte.dev'
	},
	{
		slug: 'placeholder-api',
		title: 'API platform',
		category: 'backend',
		blurb: 'Typed handlers, queues, and observability.',
		description: 'Replace with a real backend project you shipped.',
		stack: ['Node', 'Postgres', 'Redis'],
		image: '/favicon.svg'
	}
];

export const CHAT_SYSTEM_PROMPT = `You are a helpful assistant for ${SITE.name}'s portfolio site. Be concise and friendly.
About them: ${SITE.title}. They enjoy SvelteKit, TypeScript, Convex, and polished UX.
If asked about availability, say you are a demo and they should use the contact form.
Do not invent employers or credentials not implied above.`;

export const ABOUT_TIMELINE = [
	{ year: '2020', text: 'First shipped web apps; fell in love with reactive UI.' },
	{ year: '2022', text: 'Deep TypeScript + component architecture across products.' },
	{ year: '2024', text: 'Full-stack delivery: design systems, APIs, realtime data.' },
	{ year: '2026', text: 'Building this portfolio — Convex, motion, and sound.' }
] as const;

export const SKILLS: { label: string; pct: number }[] = [
	{ label: 'TypeScript', pct: 92 },
	{ label: 'Svelte / SvelteKit', pct: 90 },
	{ label: 'CSS / Tailwind', pct: 88 },
	{ label: 'APIs & data', pct: 85 }
];

export const DAILY_STACK = ['Svelte', 'TS', 'Vite', 'pnpm', 'Git', 'Convex'] as const;
