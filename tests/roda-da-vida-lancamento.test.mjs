import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync,existsSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const js=read('app.js'),html=read('index.html');
test('Roda da Vida é a primeira avaliação e só anuncia gratuidade confirmada',()=>{
 assert.match(js,/id:'roda-vida'/);assert.match(js,/policyFor\(item\)\.mode==="FREE"/);
 assert.match(js,/Começar avaliação gratuita/);assert.match(js,/Consultar disponibilidade/);
 assert.match(js,/window\.location\.assign\(rodaLink\)/);
 assert.ok(existsSync(new URL('../media/roda-vida.svg',import.meta.url)));
});
test('login do cliente entra no portal com conta verificada',()=>{
 assert.match(html,/href="https:\/\/impulso-portal-staging\.impulsoflow-f91\.workers\.dev\/minha-conta"/);
 assert.match(html,/<strong>08<\/strong>/);
});
test('outras avaliações continuam com ação comercial individual',()=>{
 assert.match(js,/Solicitar acesso/);
 assert.doesNotMatch(js,/window\.open\(item\.url/);
 assert.match(js,/policyEndpoint/);
 assert.match(js,/categoria=ACESSO_PESQUISA/);
});
