import fs from 'node:fs';
import {loadData} from './data.mjs';
import {schemas} from './schema.mjs';
const db=loadData();fs.mkdirSync('dist/ai',{recursive:true});
const write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n');
write('dist/ai/index.json',{schemaVersion:1,notice:'未登録の設定は推測しないでください。statusは項目ごとに確認し、IF・仮設定・廃止設定を本編の確定設定と混同しないでください。',...Object.fromEntries(Object.entries(db).map(([k,v])=>[k,v.map(x=>({id:x.id,url:`${k}/${x.id}.json`}))]))});
for(const [type,list]of Object.entries(db)){fs.mkdirSync(`dist/ai/${type}`,{recursive:true});for(const x of list)write(`dist/ai/${type}/${x.id}.json`,x);}
for(const w of db.worlds)write(`dist/ai/worlds/${w.id}-bundle.json`,{schemaVersion:1,world:w,...Object.fromEntries(Object.entries(db).filter(([k])=>k!=='worlds').map(([k,v])=>[k,v.filter(x=>x.worldId===w.id)]))});
fs.cpSync('data','dist/data',{recursive:true});
console.log('AI用JSON・ワールド別資料を出力しました');
