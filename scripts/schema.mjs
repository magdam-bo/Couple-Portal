import { z } from 'zod';
export const status=z.enum(['confirmed','draft','if','deprecated']);
const fact=z.object({text:z.string().min(1),status,characterId:z.string().optional()});
const base={sortOrder:z.number().optional(),id:z.string().regex(/^[a-z0-9-]+$/),status,aiNotes:z.array(z.string()).optional()};
const image=z.string().optional();
export const schemas={
 worlds:z.object({...base,name:z.string(),summary:z.string(),themeColor:z.string().regex(/^#[0-9a-fA-F]{6}$/),motif:z.enum(['stars','magic','castle']),image}),
 groups:z.object({...base,worldId:z.string(),name:z.string(),summary:z.string().optional(),themeColor:z.string().regex(/^#[0-9a-fA-F]{6}$/).optional()}),
 characters:z.object({...base,worldId:z.string(),groupIds:z.array(z.string()),name:z.string(),summary:z.string(),image,profile:z.record(fact).optional(),personality:z.record(z.array(fact)).optional(),speech:z.object({firstPerson:fact.optional(),secondPerson:fact.optional(),features:z.array(fact).optional(),samples:z.array(fact).optional(),names:z.array(z.object({characterId:z.string(),...fact.shape})).optional()}).optional(),relationships:z.array(z.object({characterId:z.string(),...fact.shape})).optional()}),
 couples:z.object({...base,worldId:z.string(),name:z.string(),characterIds:z.tuple([z.string(),z.string()]),summary:z.string(),roles:z.object({semeId:z.string(),ukeId:z.string()}).optional(),details:z.record(z.array(fact)).optional(),perspectives:z.array(z.object({characterId:z.string(),feelings:z.array(fact).optional(),recognition:z.array(fact).optional(),callsPartner:fact.optional()})).optional(),relatedCharacterIds:z.array(z.string()).optional()}),
 lore:z.object({...base,worldId:z.string(),title:z.string(),sections:z.array(z.object({id:z.string(),title:z.string(),entries:z.array(fact)}))}),
 events:z.object({...base,worldId:z.string(),title:z.string(),date:z.string().optional(),description:z.string(),characterIds:z.array(z.string()),coupleIds:z.array(z.string()).optional()})
};

// Reject unknown top-level fields rather than silently dropping user settings.
for (const name of Object.keys(schemas)) schemas[name] = schemas[name].strict();
