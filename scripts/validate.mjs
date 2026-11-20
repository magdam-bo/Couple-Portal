import {loadData} from './data.mjs';
const db=loadData();console.log('JSON・ID関連検証成功:',Object.entries(db).map(([k,v])=>`${k}=${v.length}`).join(', '));
