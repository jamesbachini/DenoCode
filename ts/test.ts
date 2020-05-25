import { Application, Router, send } from 'https://deno.land/x/oak/mod.ts';
import { oakCors } from 'https://deno.land/x/cors/mod.ts';

const port : number = 8000;
const router = new Router();
router
	.get('/', async (ctx) => {
		await send(ctx, ctx.request.url.pathname, {
			root: `${Deno.cwd()}/../`,
			index: 'index.html',
		});
	}) 
	.get('/user/:uid', async (ctx) => {
		ctx.response.status = 200
		ctx.response.body = `hello user ${ctx.params.uid}`;
  });

const app = new Application();
app.use(oakCors()); // Enable CORS for *
app.use(router.routes());

console.info(`Listening on port ${port}`);
await app.listen({ port });