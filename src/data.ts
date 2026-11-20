import type {World,Group,Character,Couple,Lore,StoryEvent} from './types';
function collect<T>(files:Record<string,unknown>):T[]{return Object.values(files) as T[];}
export const worlds=collect<World>(import.meta.glob('../data/worlds/*.json',{eager:true,import:'default'})).sort((a,b)=>(a.sortOrder??0)-(b.sortOrder??0));
export const groups=collect<Group>(import.meta.glob('../data/groups/*.json',{eager:true,import:'default'}));
export const characters=collect<Character>(import.meta.glob('../data/characters/*.json',{eager:true,import:'default'}));
export const couples=collect<Couple>(import.meta.glob('../data/couples/*.json',{eager:true,import:'default'}));
export const lore=collect<Lore>(import.meta.glob('../data/lore/*.json',{eager:true,import:'default'}));
export const events=collect<StoryEvent>(import.meta.glob('../data/events/*.json',{eager:true,import:'default'}));
export const characterName=(id:string)=>characters.find(c=>c.id===id)?.name||id;
export const memberships=(ids:string[])=>ids.map(id=>groups.find(g=>g.id===id)?.name).filter(Boolean).join(' / ');
export const labels:Record<string,string>={name:'名前',reading:'読み方',age:'年齢',height:'身長',birthday:'誕生日',affiliation:'所属',appearance:'容姿',personality:'性格',likes:'好きなもの',dislikes:'嫌いなもの',hobbies:'趣味',skills:'特技',behavior:'行動傾向',past:'過去・経歴',episodes:'重要なエピソード',meeting:'出会い',current:'現在の関係性',changes:'関係性の変化',history:'歴史',geography:'地理',society:'社会制度',organizations:'組織・団体',facilities:'施設',glossary:'用語集',timeline:'年表'};
