import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { dev } from '$app/environment';
import type { RequestHandler } from './$types';

const faviconPath = resolve('static', 'favicon.png');

export const GET: RequestHandler = async () => {
	const file = await readFile(faviconPath);

	return new Response(file, {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': dev ? 'no-store' : 'public, max-age=31536000, immutable'
		}
	});
};
