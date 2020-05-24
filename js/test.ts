import { serve } from 'https://deno.land/std/http/server.ts';
const port : number = 8000;
const s = serve({ port });
console.log(`Listening on http://localhost:${port}/`);

for await (const req of s) {
	req.respond({ body: 'Hello Typescript!' });
}

