import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import vm from "node:vm";
const read=f=>readFileSync(new URL("../"+f,import.meta.url),"utf8");
const html=read("index.html"),js=read("app.js"),release=JSON.parse(read("shared/assessment-core-release.json"));
test("carrega o Core antes do catálogo com fallback independente",()=>{
 assert.ok(html.indexOf("assessment-core.v"+release.release+".js")>=0);
 assert.ok(html.indexOf("assessment-core.v"+release.release+".js")<html.indexOf("app.js?v="));
 assert.match(js,/const items = \[/);
 assert.match(js,/if\(sharedCore\?\.release === "0\.1\.0"/);
});
test("versão publicada é íntegra e igual ao catálogo anterior",()=>{
 const browser=read("shared/assessment-core.v"+release.release+".js");
 const context={window:{}};vm.runInNewContext(browser,context);
 const core=context.window.IMPULSO_ASSESSMENT_CORE;
 assert.equal(core.checksum,release.sha256);
 assert.equal(core.assessments.length,8);
 const i=js.indexOf("const items = ["),end=js.indexOf("];",i);
 assert.ok(i>=0&&end>i);
 const items=vm.runInNewContext('const rodaLink="https://example.invalid";'+js.slice(i,end+2)+"\nitems;");
 for(const item of items){
  const linked=core.assessments.find(r=>r.legacyId===item.id);
  assert.ok(linked,"Identificador original preservado: "+item.id);
  assert.equal(linked.title,item.name);
  assert.equal(linked.category,item.category);
  assert.equal(linked.description,item.desc);
  assert.ok(item.url);
 }
 assert.equal(createHash("sha256").update(JSON.stringify({schemaVersion:core.schemaVersion,release:core.release,scope:core.scope,assessments:JSON.parse(JSON.stringify(core.assessments))},null,2)+"\n").digest("hex"),release.sha256);
});
test("o Core não altera preços, permissões ou URLs",()=>{
 assert.match(js,/const policyEndpoint/);
 assert.match(js,/const policyFor/);
 assert.match(js,/item\.name = entry\.title/);
 assert.doesNotMatch(read("shared/assessment-core.v"+release.release+".js"),/https?:\/\/|password|priceCents|API_KEY/);
});
