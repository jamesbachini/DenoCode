import { utils } from './utils.js';

utils.init();

const brand = 'Project Name';

if (utils.get.terms) utils.loadPage('pages/terms.html','content', (pageContent) => {
  return pageContent.split('[brand]').join(brand);
});
if (utils.get.privacy) utils.loadPage('pages/privacy.html','content', (pageContent) => {
  return pageContent.split('[brand]').join(brand);
});

document.addEventListener('DOMContentLoaded', (event) => {
  document.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightBlock(block);
  });
});