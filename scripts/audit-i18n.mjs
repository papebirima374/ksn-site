import { readFileSync } from "node:fs";
const src = readFileSync("lib/i18n/translations.ts","utf8");
const langs=["fr","wo","en","it","es","ar"];
const pos={}; for(const l of langs) pos[l]=src.indexOf("\n  "+l+": {");
const ord=langs.slice().sort((a,b)=>pos[a]-pos[b]);
function keys(l){const i=ord.indexOf(l);const s=pos[l];const e=i+1<ord.length?pos[ord[i+1]]:src.length;const c=src.slice(s,e);const m=c.match(/"[^"]+":/g)||[];return new Set(m.map(x=>x.slice(1,-2)));}
const K={}; for(const l of langs) K[l]=keys(l);
console.log("Clés par langue:");
for(const l of langs) console.log(`  ${l}: ${K[l].size}`);
const fr=K.fr;
for(const l of ["en","ar","it","es"]){
  const miss=[...fr].filter(k=>!K[l].has(k));
  console.log(`\n${l.toUpperCase()} — manquantes (${miss.length}):`, miss.slice(0,30).join(", ")||"(complet ✓)");
}
