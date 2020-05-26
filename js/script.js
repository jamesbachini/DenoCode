import { utils } from './utils.js';

utils.init();

const brand = 'DenoCode';

const loadModules = async (filter=false) => {
	const modules = await utils.loadJSON('modules.json');
	let html = '';
	const sortable = [];
	Object.keys(modules).forEach((title) => {
		sortable.push(modules[title]);
	});
	sortable.sort(function(a, b) {
		return a.stars - b.stars;
	}).reverse();
	sortable.forEach((m) => {
		if (m.type !== 'github') return false; // 2do add support for npm
		if (m.repo === 'typescript' || m.repo === 'deno') return false;
		if (m.repo === 'lodash') m.url = 'https://deno.land/x/lodash/index.js';
		if (m.repo === 'date-fns') m.url = 'https://deno.land/x/date_fns/index.js';
		if (m.repo === 'omelette') m.url = 'https://deno.land/x/omelette/omelette.ts';
		if (m.repo === 'alosaur') m.url = 'https://deno.land/x/alosaur/src/mod.ts';
		if (m.repo === 'pogo') m.url = 'https://deno.land/x/pogo/main.ts';

		if (filter) {
			const filterLC = filter.toLowerCase();
			const searchString = `${m.repo} ${m.owner} ${m.desc}`.toLowerCase();
			if (!searchString.includes(filterLC)) return false;
		}
		const variableName = utils.camelize(m.repo.split('-').join(' ').split('_').join(''));
		let importCode = 'import url unknown';
		if (m.url && m.url !== 'unknown') importCode = `import { ${variableName} } from '${m.url}';`
		let buttons = `<button class="button-open-link button-module" data-selection="https://github.com/${m.owner}/${m.repo}/#readme">📄 README</button> `;
		if (m.url && m.url !== 'unknown') buttons += `<button class="button-copy button-module" data-selection="module-import-${m.repo}">🔗 COPY</button>`;
		html += `<div class="flex-1 module-box">
        <div class="module-header bkg-navy text-center flex-row">
					<div class="flex-3">
						<div class="module-title" title="Repository: ${m.repo}">${m.repo}</div>
						<div class="small-print grey"> by ${m.owner}</div>
					</div>
					<div class="flex-1 text-center">
						<div title="Github Stars">⭐</div>
						<div title="Github Stars" class="module-stars small-print">${m.stars}</div>
					</div>
					<div class="flex-1 text-center">
						<div title="Github Issues">⚠️</div>
						<div title="Github Issues" class="module-stars small-print">${m.issues}</div>
					</div>
        </div>
        <div class="module-body">
					<div class="flex-row">
						<div class="flex-1">
							<img src="${m.thumbnail}" alt="${m.repo} ${m.repo}" class="module-thumb" />
						</div>
						<div class="flex-3">
							<div class="module-description">${m.desc}</div>
							<div class="module-stats flex-column small-print">
								<div class="flex-1 grey" title="License: ${m.license}">License: ${m.licenseShort}</div>
								<div class="flex-1 grey">Size: ${m.size}</div>
								<div class="flex-1 grey">Language: ${m.language}</div>
								<div class="flex-1 grey">Created: ${m.created.split('T')[0]}</div>
								<div class="flex-1 grey">Updated: ${m.updated.split('T')[0]}</div>
							</div>
						</div>
					</div>
					<div class="module-include spacer full-width text-center" id="module-import-${m.repo}">${importCode}</div>
					<div class="module-buttons">
						${buttons}
					</div>
        </div>
      </div>`;
	});
	document.getElementById('modules-container').innerHTML = html;
	start();
}

const routes = () => {
	if (utils.get.terms) utils.loadPage('pages/terms.html','content', (pageContent) => {
		return pageContent.split('[brand]').join(brand);
	});
	if (utils.get.privacy) utils.loadPage('pages/privacy.html','content', (pageContent) => {
		return pageContent.split('[brand]').join(brand);
	});
	if (utils.get.start) {
		utils.loadPage('pages/start.html','content');
		document.title = 'How To Get Started With Deno';
	}
	if (utils.get.examples) {
		utils.loadPage('pages/examples.html','content');
		document.title = 'Deno Example Code';
	}
	if (utils.get.snippets) {
		utils.loadPage('pages/snippets.html','content');
		document.title = 'Deno Code Snippets';
	}
	if (utils.get.modules) {
		utils.loadPage('pages/modules.html','content');
		document.title = 'Deno Modules, Packages &amp; Libraries';
		loadModules();
	}
	if (utils.get.community) {
		utils.loadPage('pages/community.html','content');
		document.title = 'Deno Community Websites';
	}
	if (utils.get.errors) {
		utils.loadPage('pages/errors.html','content');
		document.title = 'Deno Error Codes &amp; Solutions';
	}
};


const switchLanguage = (lang) => {
	let alt = 'js';
	if (lang === 'js') alt = 'ts';
	document.querySelectorAll(`.button-${lang}`).forEach((el) => {
		el.style.background = '#7fb069';
	});
	document.querySelectorAll(`.button-${alt}`).forEach((el) => {
		el.style.background = '#fea82f';
	});
		document.querySelectorAll(`.${lang}`).forEach((el) => {
		el.classList.remove('hidden');
	});
	document.querySelectorAll(`.${alt}`).forEach((el) => {
		el.classList.add('hidden');
	});
	localStorage.setItem('lang', lang);
};


const start = () => {

	hljs.configure({tabReplace: '  '})
	document.querySelectorAll('pre code').forEach((block) => {
		hljs.highlightBlock(block);
	});

	document.querySelectorAll('.button-js').forEach((el) => {
		el.onclick = () => {
			switchLanguage('js');
		}
	});

	document.querySelectorAll('.button-ts').forEach((el) => {
		el.onclick = () => {
			switchLanguage('ts');
		}
	});

	document.querySelectorAll('.button-copy').forEach((el) => {
		el.onclick = () => {
			const elID = el.dataset.selection;
			utils.copyToClipboard(elID);
		}
	});

	document.querySelectorAll('.button-open-link').forEach((el) => {
		el.onclick = () => {
			const url = el.dataset.selection;
			window.open(url, '_blank'); 
		}
	});

	if (document.getElementById('button-module-search')) {
		document.getElementById('button-module-search').onclick = () => {
			const q = document.getElementById('input-module-search').value;
			loadModules(q);
		}
		document.getElementById('input-module-search').onkeyup = (e) => {
			loadModules(document.getElementById('input-module-search').value);
		}
	}

	if (localStorage.lang) {
		switchLanguage(localStorage.lang);
	} else {
		switchLanguage('js');
	}
};

routes();
start();
