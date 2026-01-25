import { handler } from './build/handler.js';
import express from 'express';

const app = express();

// Use Render's PORT or default to 3000
const port = process.env.PORT || 3000;

// Let SvelteKit handle everything
app.use(handler);

app.listen(port, '0.0.0.0', () => {
	console.log(`Server running on http://0.0.0.0:${port}`);
});
