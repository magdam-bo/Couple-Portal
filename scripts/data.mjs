import fs from 'node:fs';
import path from 'node:path';
import {schemas} from './schema.mjs';
export function loadData(root='data') {
 const db={};
 for(const [type,schema] of Object.entries(schemas)) {
  db[type]=fs.readdirSync(path.join(root,type)).filter(n=>n.endsWith('.json')).sort().map(n=>schema.parse(JSON.parse(fs.readFileSync(path.join(root,type,n),'utf8'))));
 }
 validateReferences(db);return db;
}
export function validateReferences(db) {
 const ids=new Set();for(const list of Object.values(db))for(const item of list){if(ids.has(item.id))throw Error(`重複ID: ${item.id}`);ids.add(item.id);}
 const world=id=>db.worlds.find(w=>w.id===id);
 const char=(id,w)=>{const c=db.characters.find(c=>c.id===id);if(!c||c.worldId!==w)throw Error(`不正なキャラクター参照: ${id}`);return c;};
 for(const [type,list]of Object.entries(db))if(type!=='worlds')for(const item of list){if(!world(item.worldId))throw Error(`不正なワールド: ${item.id}`);}
 for(const c of db.characters){for(const id of c.groupIds){if(!db.groups.some(g=>g.id===id&&g.worldId===c.worldId))throw Error(`不正な所属: ${id}`);}for(const r of [...(c.relationships||[]),...(c.speech?.names||[])])char(r.characterId,c.worldId);}
 for(const c of db.couples){if(c.characterIds[0]===c.characterIds[1])throw Error('同一人物のカップリング');c.characterIds.forEach(id=>char(id,c.worldId));for(const id of Object.values(c.roles||{}))if(!c.characterIds.includes(id))throw Error('不正な攻め受け');if(c.roles&&c.roles.semeId===c.roles.ukeId)throw Error('攻め受けの重複');for(const p of c.perspectives||[])if(!c.characterIds.includes(p.characterId))throw Error('不正な視点');(c.relatedCharacterIds||[]).forEach(id=>char(id,c.worldId));}
 for(const e of db.events){e.characterIds.forEach(id=>char(id,e.worldId));for(const id of e.coupleIds||[])if(!db.couples.some(c=>c.id===id&&c.worldId===e.worldId))throw Error('不正なイベント参照');}
}
