import { utils } from './utils.js';

utils.init();

const brand = 'DenoCode';

const loadModules = async (filter=false) => {
	const modules = await utils.loadJSON('modules.json');
	let html = '';
	Object.keys(modules).forEach((title) => {
		const m = modules[title];
		if (m.type !== 'github') return false; // 2do add support for npm
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
        <div class="module-header bkg-navy text-center">
          <div class="module-title">${m.repo}</div>
					<div class="small-print grey"> by ${m.owner}</div>
        </div>
        <div class="module-body">
          <div class="module-description">${m.desc}</div>
          <div class="module-include grey" id="module-import-${m.repo}">${importCode}</div>
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
