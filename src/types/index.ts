export type Status='confirmed'|'draft'|'if'|'deprecated';
export interface Fact {text:string;status:Status;characterId?:string}
export interface Base {sortOrder?:number;id:string;status:Status;aiNotes?:string[]}
export interface World extends Base {name:string;summary:string;themeColor:string;motif:'stars'|'magic'|'castle';image?:string}
export interface Group extends Base {worldId:string;name:string;summary?:string;themeColor?:string}
export interface Character extends Base {worldId:string;groupIds:string[];name:string;summary:string;image?:string;profile?:Record<string,Fact>;personality?:Record<string,Fact[]>;speech?:{firstPerson?:Fact;secondPerson?:Fact;features?:Fact[];samples?:Fact[];names?: (Fact&{characterId:string})[]};relationships?:(Fact&{characterId:string})[]}
export interface Couple extends Base {worldId:string;name:string;characterIds:[string,string];summary:string;roles?:{semeId:string;ukeId:string};details?:Record<string,Fact[]>;perspectives?:{characterId:string;feelings?:Fact[];recognition?:Fact[];callsPartner?:Fact}[];relatedCharacterIds?:string[]}
export interface Lore extends Base {worldId:string;title:string;sections:{id:string;title:string;entries:Fact[]}[]}
export interface StoryEvent extends Base {worldId:string;title:string;date?:string;description:string;characterIds:string[];coupleIds?:string[]}
