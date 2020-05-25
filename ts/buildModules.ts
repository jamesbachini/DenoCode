const loadJSON = async (url : string) => {
  return new Promise(resolve => {
    fetch(url)
    .then(response => response.json())
    .then(json => resolve(json));
  });
};

async function asyncForEach(array : any, callback : any) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const findURL = async (m : any) => {
  if (!m.repo) return false;
  const possibleURLs = [`https://raw.githubusercontent.com/${m.owner}/${m.repo}/master/mod.ts`, `https://raw.githubusercontent.com/${m.owner}/${m.repo}/dist/master/mod.ts`, `https://raw.githubusercontent.com/${m.owner}/${m.repo}/src/master/mod.ts`,`https://deno.land/x/${m.repo}/index.js`,`https://raw.githubusercontent.com/${m.owner}/${m.repo}/master/${m.repo.split('deno-').join('')}.ts`,`https://raw.githubusercontent.com/${m.owner}/${m.repo}/dist/master/${m.repo.split('deno-').join('')}.ts`,`https://raw.githubusercontent.com/${m.owner}/${m.repo}/src/master/${m.repo.split('deno-').join('')}.ts`];
  let found = false;
  const urlTest = await asyncForEach(possibleURLs, async (url : string) => {
    if (!found) {
      const response = await fetch(url);
      const data = await response.text();
      if (response.ok) {
        found = true;
        m.url = url;
        console.log(`Success: ${m.repo}`);
        return url;
      }
    }
  });
  if (!found) {
    console.log(`Fail: ${m.repo}`);
    return 'unknown';
  } else {
    return m.url;
  }
}

const writeOut = async () => {
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(modules));
  await Deno.writeFile('../modulesNew.json', data);
  console.log('Wrote to ../modulesNew.json');
};

const testModules = async () => {
  let html : string = '';
  let c : number = 0;
	Object.keys(modules).forEach(async (title : string) => {
    const url : any = await findURL(modules[title]);
    modules[title].url = url;
    c += 1;
    if (c === Object.keys.length) setTimeout(() => { writeOut(); }, 20000);
  });
};

const denoCodeModules : any = await loadJSON('https://raw.githubusercontent.com/denoland/deno_website2/master/database.json');
const denoLandModules : any = await loadJSON('https://raw.githubusercontent.com/denoland/deno_website2/master/database.json');
const modules : any = Object.assign(denoCodeModules, denoLandModules);

testModules();
    