import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');
const html=read('index.html'),js=read('app.js'),css=read('style.css');
test('não mostra regras administrativas nem cartão de condição comercial',()=>{
 assert.doesNotMatch(html,/class="disclaimer"|Confira o acesso|class="scenario-panel"/);
 assert.doesNotMatch(js,/card-commercial|card-status|Consulte preço/);
});
test('cada pesquisa apresenta uma ação única e não envia para questionário diretamente',()=>{
 assert.match(js,/Solicitar acesso/);
 assert.doesNotMatch(js,/window\.open\(item\.url/);
 assert.doesNotMatch(js,/"Abrir pesquisa oficial"/);
 assert.match(js,/showConditions\(item\)/);
});
test('imagens inteiras preservam enquadramento e layout responsivo',()=>{
 assert.match(css,/object-fit:contain!important/);
 assert.match(css,/aspect-ratio:16\/9!important/);
 assert.match(css,/@media\(max-width:600px\)/);
});
