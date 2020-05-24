import { serve } from 'https://deno.land/std/http/server.ts';
import {
	acceptWebSocket,
	isWebSocketCloseEvent,
	isWebSocketPingEvent,
} from 'https://deno.land/std/ws/mod.ts';
const port : string = Deno.args[0] || '8000';
console.log(`websocket server is running on :${port}`);
for await (const req of serve(`:${port}`)) {
	const { conn, r: bufReader, w: bufWriter, headers } = req;
	const sock = await acceptWebSocket({
		conn,
		bufReader,
		bufWriter,
		headers,
	});
	for await (const ev of sock) {
		console.log(ev);
		await sock.send(ev);
	}
}
