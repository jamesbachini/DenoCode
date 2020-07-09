import { utils } from './../core/utils.js';
/* global vSettings */

export const routes = {
	init: async () => {
		const get = utils.getQueryParams();
		if (get.page && get.page === 'home') {
			// Home Page
			await utils.loadModule('pages/home.html','content');
			utils.setTitle(`${vSettings.brand} | Home`);
		} else if (get.page && get.page === 'terms') {
			// Terms & Conditions
			await utils.loadModule('pages/terms.html','content', (pageContent) => {
				return pageContent.split('[brand]').join(vSettings.brand);
			});
			utils.setTitle(`${vSettings.brand} Terms and Conditions`);
		} else if (get.page && get.page === 'privacy') {
			// Privacy Policy
			await utils.loadModule('pages/privacy.html','content', (pageContent) => {
				return pageContent.split('[brand]').join(vSettings.brand);
			});
			utils.setTitle(`${vSettings.brand} Privacy Policy`);
		} else if (get.page && get.page === 'start') {
			await utils.loadModule('pages/start.html','content');
			utils.setTitle('How To Get Started With Deno | Definitive Guide');
		} else if (get.page && get.page === 'examples') {
			await utils.loadModule('pages/examples.html','content');
			utils.setTitle('6 Deno Code Examples | Deno Example Code');
			utils.setDescription('Deno code examples including OAK with CORS, websockets, testing and docker');
		} else if (get.page && get.page === 'snippets') {
			await utils.loadModule('pages/snippets.html','content');
			utils.setTitle('Deno Code Snippets');
		} else if (get.page && get.page === 'modules') {
			await utils.loadModule('pages/modules.html','content');
			utils.setTitle('Deno Modules, Packages & Libraries');
			loadDenoModules();
		} else if (get.page && get.page === 'community') {
			await utils.loadModule('pages/community.html','content');
			utils.setTitle('Deno Community Websites | Meet Deno Developers');
		} else if (get.page && get.page === 'errors') {
			await utils.loadModule('pages/errors.html','content');
			utils.setTitle('Deno Error Codes & Solutions');
		} else if (get.page && get.page === 'deno-vs-node') {
			await utils.loadModule('pages/deno-vs-node.html','content');
			utils.setTitle('Deno vs Node.js | Comparison & Performance');
		} else if (get.page) {
			// automatically catch any pages without dedicated routes
			const cleanPage = utils.cleanString(get.page);
			const cleanTitle = utils.titleCase(cleanPage);
			await utils.loadModule(`pages/${cleanPage}.html`,'content');
			utils.setTitle(`${vSettings.brand} | ${cleanTitle}`);
		} else {
			// load home page if no page= variable specified in URL
			await utils.loadModule('pages/home.html','content');
			utils.setTitle('DenoCode | Deno Developer Portal');
			utils.setDescription(`DenoCode is the developer site for Deno - The modern Javascript runtime from the creator of Node.JS`);
		}
		return true;
	},
}
