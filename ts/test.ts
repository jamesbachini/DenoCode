import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

Deno.test('Test Example Sync', () => {
  const a : number = 2 + 2;
  assertEquals(a, 4);
});

Deno.test('Test Example Async', async () => {
  const a : number = 2 + 2;
  await new Promise(r => setTimeout(r, 2000)); 
  if (a !== 4) throw Error('Late night required');
});