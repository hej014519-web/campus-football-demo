import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const require=createRequire(import.meta.url);
const esbuildPath=require.resolve('esbuild',{paths:[root,...(process.env.DEMO_NODE_MODULES?[process.env.DEMO_NODE_MODULES]:[])]});
const {build}=await import(pathToFileURL(esbuildPath).href);
const result=await build({entryPoints:[path.join(root,'src/lib/demo.ts')],bundle:true,write:false,format:'esm',platform:'node',target:'es2020'});
const demo=await import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].text).toString('base64'));
let count=0;function test(name,fn){fn();count++;console.log('PASS '+name);}
const actors={};
for(const role of demo.DEMO_ROLES){
 test(role+' accepts shared demonstration credentials',()=>{actors[role]=demo.authenticateDemo(role,'何珈俊','123456');assert.equal(actors[role].role,role);assert.equal(actors[role].username,'何珈俊');});
 test(role+' rejects wrong password',()=>assert.throws(()=>demo.authenticateDemo(role,'何珈俊','wrong')));
 test(role+' rejects wrong username',()=>assert.throws(()=>demo.authenticateDemo(role,'其他账号','123456')));
}
test('unsupported role is rejected',()=>assert.throws(()=>demo.authenticateDemo('admin','何珈俊','123456')));
const store=demo.createDemoStore();
const originalFetch=globalThis.fetch;let attemptedRequests=0;globalThis.fetch=()=>{attemptedRequests++;throw Error('Network calls are forbidden in this demonstration');};
try{
 test('audience can browse public data without any login',()=>assert.ok(store.publicData().matches.length>0));
 test('audience workspace does not contain private team forms',()=>assert.equal(store.workspace(actors.audience).teams.length,0));
 test('player workspace contains only fictional school team',()=>{const teams=store.workspace(actors.player).teams;assert.equal(teams.length,1);assert.equal(teams[0].school,'示例大学');assert.match(teams[0].athletes[0].idNumber,/^DEMO-/);});
 const team=store.workspace(actors.player).teams[0];
 test('player can save an in-page draft',()=>assert.equal(store.dispatch('saveTeam',{...team,privacyConsent:true},actors.player).team.status,'draft'));
 test('player can simulate submitting a roster',()=>assert.equal(store.dispatch('submitTeam',{teamId:team.id},actors.player).team.status,'submitted'));
 test('submitted fictional roster is locked',()=>assert.throws(()=>store.dispatch('saveTeam',{...team,name:'改动锁定队名'},actors.player)));
 test('material action creates metadata only, never file content',()=>{const file=store.dispatch('markMaterial',{teamId:team.id,kind:'虚构证件材料'},actors.player).file;assert.equal(file.name,'虚构示例材料.pdf');assert.equal('body' in file,false);assert.equal('url' in file,false);});
 test('staff can return a fictional submission',()=>{store.dispatch('reviewTeam',{teamId:team.id,status:'returned',reason:'示例补正说明'},actors.staff);assert.equal(store.workspace(actors.player).teams[0].status,'returned');});
 test('player can resubmit the same fictional roster',()=>assert.equal(store.dispatch('submitTeam',{teamId:team.id},actors.player).team.status,'submitted'));
 test('staff can simulate approval',()=>{store.dispatch('reviewTeam',{teamId:team.id,status:'approved',confirmations:{eligibility:true,health:true,insurance:true,signatures:true}},actors.staff);assert.equal(store.workspace(actors.player).teams[0].status,'approved');});
 test('audience cannot enter staff operations through the local UI model',()=>assert.throws(()=>store.dispatch('reviewTeam',{teamId:team.id,status:'approved'},actors.audience)));
 test('referee can simulate a score report',()=>store.dispatch('submitScore',{matchId:'demo-match-1',homeScore:3,awayScore:2,notes:'虚构比赛报告'},actors.referee));
 test('unpublished score stays hidden in public demonstration',()=>assert.equal(store.publicData().matches.find(m=>m.id==='demo-match-1').homeScore,null));
 test('staff can publish simulated score',()=>{store.dispatch('publishScore',{matchId:'demo-match-1'},actors.staff);assert.equal(store.publicData().matches.find(m=>m.id==='demo-match-1').homeScore,3);});
 test('new page store resets prior actions',()=>assert.equal(demo.createDemoStore().workspace(actors.player).teams[0].status,'draft'));
 test('no simulated operation makes a network request',()=>assert.equal(attemptedRequests,0));
}finally{globalThis.fetch=originalFetch;}
const source=await fs.readFile(path.join(root,'src/portal.tsx'),'utf8');const model=await fs.readFile(path.join(root,'src/lib/demo.ts'),'utf8');const html=await fs.readFile(path.join(root,'index.html'),'utf8');
test('application source has no backend API or network calls',()=>assert.doesNotMatch(source+model,/\bfetch\s*\(|XMLHttpRequest|WebSocket|\/api\//));
test('application has no ChatGPT authentication or bypass-preview entrance',()=>assert.doesNotMatch(source,/signin-with-chatgpt|platformSignedIn|preview\s*\(|预览工作台/));
test('application has no persistent browser storage',()=>assert.doesNotMatch(source+model,/localStorage|sessionStorage|indexedDB|document\.cookie/));
test('no personal file picker or file reading is present',()=>assert.doesNotMatch(source,/type=["']file["']|FileReader|\.arrayBuffer\s*\(|\.text\s*\(/));
test('published page always labels itself as a fictional demonstration',()=>{assert.match(html,/功能演示站/);assert.match(html,/虚构资料/);assert.match(html,/刷新即清空/);});
test('published page blocks network connections by policy',()=>assert.match(html,/connect-src 'none'/));
test('published page has no CDN or external script or stylesheet',()=>assert.doesNotMatch(html,/<script[^>]+src=|<link[^>]+rel=["']stylesheet/));
test('favicon works from a GitHub Pages repository subpath',()=>assert.match(html,/href="\.\/favicon\.svg"/));
console.log(`\n${count} checks passed. Client-only demonstration, not a security or production acceptance test.`);
