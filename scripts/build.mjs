import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const require=createRequire(import.meta.url);
// Optional local dependency location is only a build-time convenience. It is not embedded in index.html.
const search=[root,...(process.env.DEMO_NODE_MODULES?[process.env.DEMO_NODE_MODULES]:[])];
const esbuildPath=require.resolve('esbuild',{paths:search});
const {build}=await import(pathToFileURL(esbuildPath).href);
const result=await build({entryPoints:[path.join(root,'src/main.tsx')],bundle:true,write:false,minify:true,platform:'browser',format:'iife',jsx:'automatic',target:['es2020'],charset:'utf8',nodePaths:process.env.DEMO_NODE_MODULES?[process.env.DEMO_NODE_MODULES]:[],define:{'process.env.NODE_ENV':'"production"'},legalComments:'eof'});
const css=await fs.readFile(path.join(root,'src/styles.css'),'utf8');
if(/@import|https?:\/\//.test(css))throw Error('Styles must not load external fonts or styles.');
const script=result.outputFiles[0].text.replace(/<\/script/gi,'<\\/script');
const html=`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="description" content="校园足球四种身份功能演示。仅使用虚构资料，不受理真实报名，操作仅保留在当前页面。"><meta name="referrer" content="no-referrer"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'none'; base-uri 'self'; form-action 'none'"><title>校园足球 · 功能演示站</title><link rel="icon" href="./favicon.svg"><style>${css}</style></head><body><div id="root"></div><noscript>本演示站需要启用JavaScript。它不连接后台，不受理真实报名。</noscript><script>${script}</script></body></html>`;
await fs.writeFile(path.join(root,'index.html'),html);
console.log(`Built index.html (${Buffer.byteLength(html)} bytes). All application scripts and CSS are inline; no backend or CDN required.`);
