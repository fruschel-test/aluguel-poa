(() => {
"use strict";
const STORAGE_KEY="aluguel-poa-listings-v1", LIMIT=2200;
const form=document.querySelector("#listing-form"), listingsEl=document.querySelector("#listings"), emptyEl=document.querySelector("#empty");
const filterNeighborhood=document.querySelector("#filter-neighborhood"), filterCost=document.querySelector("#filter-cost"), filterText=document.querySelector("#filter-text");
let listings=load();
function load(){try{const x=JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");return Array.isArray(x)?x:[]}catch{return[]}}
function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(listings))}catch{alert("Não foi possível guardar os dados neste navegador. Exporte os dados para não perdê-los.")}}
function money(v){return Number(v||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}
function total(x){return Number(x.rent)+Number(x.condo)+Number(x.tax)+Number(x.other)}
function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n}
function render(){
 listingsEl.replaceChildren();const text=filterText.value.trim().toLocaleLowerCase("pt-BR");
 const shown=listings.filter(x=>{
  if(filterNeighborhood.value&&x.neighborhood!==filterNeighborhood.value)return false;
  if(text&&!(x.title+" "+x.notes).toLocaleLowerCase("pt-BR").includes(text))return false;
  if(filterCost.value==="within"&&(!x.confirmed||total(x)>LIMIT))return false;
  if(filterCost.value==="over"&&total(x)<=LIMIT)return false;
  if(filterCost.value==="unknown"&&x.confirmed)return false;
  return true;
 }).sort((a,b)=>total(a)-total(b));
 for(const item of shown){
  const card=el("article","listing");card.append(el("h3","",item.title),el("p","location",item.neighborhood+" · Porto Alegre"));
  const cls=!item.confirmed?"status unknown":total(item)<=LIMIT?"status ok":"status over";
  const txt=!item.confirmed?"Custo não confirmado":total(item)<=LIMIT?"Dentro do limite":"Acima do limite";
  card.append(el("span",cls,txt),el("p","price",money(total(item))+" / mês"));
  const breakdown=el("div","breakdown");
  for(const [label,value] of [["Aluguel",item.rent],["Condomínio",item.condo],["IPTU mensal",item.tax],["Outras taxas",item.other]])breakdown.append(el("span","",label),el("strong","",money(value)));
  card.append(breakdown);if(item.notes)card.append(el("p","muted",item.notes));
  card.append(el("p","footnote","Cadastrado em "+new Date(item.createdAt).toLocaleDateString("pt-BR")));
  const actions=el("div","card-actions"),link=el("a","","Abrir anúncio ↗");link.href=item.url;link.target="_blank";link.rel="noopener noreferrer";actions.append(link);
  const edit=el("button","secondary","Editar");edit.type="button";edit.addEventListener("click",()=>editItem(item.id));
  const del=el("button","secondary","Excluir");del.type="button";del.addEventListener("click",()=>{if(confirm("Excluir este imóvel?")){listings=listings.filter(x=>x.id!==item.id);save();render()}});
  actions.append(edit,del);card.append(actions);listingsEl.append(card);
 }
 emptyEl.hidden=shown.length>0;
 document.querySelector("#count").textContent=String(listings.length);
 document.querySelector("#within").textContent=String(listings.filter(x=>x.confirmed&&total(x)<=LIMIT).length);
}
function editItem(id){const x=listings.find(y=>y.id===id);if(!x)return;for(const k of ["title","neighborhood","url","rent","condo","tax","other","notes"])form.elements[k].value=x[k]??"";form.elements.confirmed.checked=Boolean(x.confirmed);form.dataset.editing=id;form.querySelector('button[type="submit"]').textContent="Salvar alterações";form.scrollIntoView({behavior:"smooth",block:"start"})}
form.addEventListener("submit",e=>{
 e.preventDefault();const data=new FormData(form),url=String(data.get("url")||"").trim();
 try{const u=new URL(url);if(!["http:","https:"].includes(u.protocol))throw Error()}catch{alert("Informe um link válido iniciado por https:// ou http://.");return}
 const item={id:form.dataset.editing||(crypto.randomUUID?crypto.randomUUID():String(Date.now())),title:String(data.get("title")).trim(),neighborhood:String(data.get("neighborhood")),url,rent:Number(data.get("rent")),condo:Number(data.get("condo")),tax:Number(data.get("tax")),other:Number(data.get("other")),notes:String(data.get("notes")||"").trim(),confirmed:Boolean(data.get("confirmed")),createdAt:new Date().toISOString()};
 if([item.rent,item.condo,item.tax,item.other].some(n=>!Number.isFinite(n)||n<0)){alert("Informe valores válidos e não negativos para todos os custos.");return}
 if(form.dataset.editing)listings=listings.map(x=>x.id===item.id?item:x);else listings.push(item);
 delete form.dataset.editing;form.querySelector('button[type="submit"]').textContent="Adicionar imóvel";save();form.reset();render();
});
form.addEventListener("reset",()=>{delete form.dataset.editing;form.querySelector('button[type="submit"]').textContent="Adicionar imóvel"});
[filterNeighborhood,filterCost,filterText].forEach(x=>x.addEventListener("input",render));
document.querySelector("#export").addEventListener("click",()=>{const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),listings},null,2)],{type:"application/json"});const url=URL.createObjectURL(blob),a=el("a");a.href=url;a.download="aluguel-poa-backup.json";a.click();URL.revokeObjectURL(url)});
render();
})();