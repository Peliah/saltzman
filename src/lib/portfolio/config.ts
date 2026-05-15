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
		slug: 'draft-resume',
		title: 'ResumeDraft',
		category: 'fullstack',
		blurb: 'AI resume tailor — job-specific alignment, ethical rewriting, ATS-safe export.',
		description:
			'ResumeDraft helps job seekers tailor a resume to each posting: upload a resume and paste the job description, answer targeted interview-style questions, then review transparent bullet-level edits before exporting PDF or DOCX. Built around ethical AI (no invented metrics), ATS-friendly formatting, and credit-based pricing.',
		stack: ['Next.js', 'TypeScript', 'AI', 'PDF export'],
		image: '/projects/draft-resume/cover.png',
		liveUrl: 'https://draft-resume.com'
	},
	{
		slug: 'peliah-resolve',
		title: 'Resolve',
		category: 'frontend',
		blurb: 'Product UI and flows — web build focused on clarity and conversion.',
		description:
			'Case study from peliah.vercel.app: a web product with polished layouts, responsive structure, and interactive UI for end-user tasks.',
		stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
		image: '/projects/peliah/resolve.png',
		liveUrl: 'https://peliah.vercel.app/projects/Resolve?data=1',
		repoUrl: 'https://github.com/Peliah'
	},
	{
		slug: 'peliah-chrome-ai',
		title: 'Chrome AI Chat Assistant',
		category: 'fullstack',
		blurb: 'Browser-side chat experience powered by Chrome AI APIs.',
		description:
			'Case study from peliah.vercel.app: chat assistant built with Next.js and Chrome built-in AI, with TypeScript and Tailwind for UI.',
		stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Chrome AI'],
		image: '/projects/peliah/chat-bot.png',
		liveUrl: 'https://peliah.vercel.app/projects/Chrome%20AI%20Chat%20Assistant?data=1',
		repoUrl: 'https://github.com/Peliah'
	},
	{
		slug: 'peliah-meet-n-greet',
		title: 'Meet-N-Greet',
		category: 'fullstack',
		blurb: 'Event management platform — scheduling, attendee flows, and operations.',
		description:
			'Case study from peliah.vercel.app: event tooling for organizers with web-first workflows and a cohesive product surface.',
		stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
		image: '/projects/peliah/meet-n-greet-1.png',
		liveUrl: 'https://peliah.vercel.app/projects/Meet-N-Greet?data=1',
		repoUrl: 'https://github.com/Peliah'
	},
	{
		slug: 'peliah-e-library-237',
		title: 'E-Library 237',
		category: 'frontend',
		blurb: 'Digital library experience — browse, discover, and read with a focused UX.',
		description:
			'Case study from peliah.vercel.app: catalog-style web app for books or media with modern layout and responsive behavior.',
		stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
		image: '/projects/peliah/e-library-237.png',
		liveUrl: 'https://peliah.vercel.app/projects/E-Library%20237?data=1',
		repoUrl: 'https://github.com/Peliah'
	},
	{
		slug: 'peliah-ecommerce',
		title: 'E-commerce platform',
		category: 'fullstack',
		blurb: 'Full-stack shopping flows — catalog, cart, and checkout-oriented UX.',
		description:
			'Case study from peliah.vercel.app: full-stack commerce UI and supporting features for product discovery and purchase paths.',
		stack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
		image: '/projects/peliah/collers.png',
		liveUrl: 'https://peliah.vercel.app/projects/E-commerce%20Platform?data=1',
		repoUrl: 'https://github.com/Peliah'
	},
	{
		slug: 'peliah-lecture-transcription',
		title: 'Lecture recording & transcription',
		category: 'backend',
		blurb: 'Capture audio, process with FFmpeg, transcribe locally with Vosk, SQLite storage.',
		description:
			'Case study from peliah.vercel.app: lecture pipeline with recording, transcription (Vosk), SQLite persistence, and HTML/Bootstrap surfaces.',
		stack: ['Python', 'SQLite', 'Vosk', 'FFmpeg', 'Bootstrap'],
		image: '/projects/peliah/lecture_upload.png',
		liveUrl: 'https://peliah.vercel.app/projects/Lecture%20Recording%20and%20Transcription?data=1',
		repoUrl: 'https://github.com/Peliah'
	},
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
