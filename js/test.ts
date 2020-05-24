console.log('Wait for it...');
const timer : number = 2000;
await new Promise(r => setTimeout(r, timer));
console.log('boo!');