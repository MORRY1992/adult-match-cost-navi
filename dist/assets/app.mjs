import {calculate} from './cost.mjs';
const form=document.querySelector('#cost-form');
const yen=n=>n==null?'要確認':`${n.toLocaleString('ja-JP',{maximumFractionDigits:2})}円`;
const escape=s=>String(s).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const labels={verified:'公式確認済み',conditional:'条件付き',unknown:'要確認'};
const channelLabels={web:'Web決済',ios:'iPhone決済',android:'Android決済'};
const purposeNotes={all:'料金の安さだけでなく、利用資格・更新・解約条件も確認してください。',short:'利用期間に応じた初回請求額と、自動更新を止める締切を確認してください。',cost:'月額換算は支払方法ではありません。初回の一括請求額もあわせて確認してください。',options:'選択できるのは確認済みのマリッシュ・プレミアムです。他サービスのオプションは要確認です。',marriage:'婚活を案内するサービスを表示します。利用者数や成功率に基づく順位ではありません。',adult:'18歳以上向けポイント制サービスを表示。消費換算は現金の支払総額と異なります。',cancel:'各結果の契約条件へ進み、支払経路と更新停止期限を確認してください。'};
let catalog;
async function render(){
 if(!catalog)return;
 const data=new FormData(form);
 const opts={months:Number(data.get('months')),channel:data.get('channel'),billing:data.get('billing'),option:data.get('option'),messages:Number(data.get('messages')),profiles:Number(data.get('profiles'))};
 let rows=catalog.services.filter(s=>data.get('purpose')==='marriage'?s.category==='marriage':data.get('purpose')==='adult'?s.category==='adult':true).map(s=>({s,r:calculate(s,opts)}));
 if(data.get('sort')==='total')rows.sort((a,b)=>(a.r.total??Infinity)-(b.r.total??Infinity));
 document.querySelector('#result-summary').textContent=`${opts.months}か月・${channelLabels[opts.channel]}・${opts.billing==='bundle'?'一括払い':'1か月プラン継続'} · ${rows.length}サービス`;
 document.querySelector('#purpose-note').textContent=purposeNotes[data.get('purpose')];
 document.querySelector('#results').innerHTML=rows.map(({s,r})=>`<article class="result-card" data-service="${s.id}"><div class="result-service"><span class="service-monogram ${s.id}">${s.initial}</span><div><h4><a href="/services/${s.id}/">${s.name}</a></h4><span class="tiny">${escape(s.plan)}</span></div></div><div class="result-price"><span class="price-label">${s.type==='points'?'消費ポイントの参考換算':`${opts.months}か月の${opts.billing==='monthly'?'比較用試算':'支払総額'}`}</span><strong class="result-amount">${s.type==='points'&&r.requiredPoints!=null?`${s.points.approximate?'約':''}${yen(r.consumptionYen)}`:yen(r.total)}</strong><small>${s.type==='points'?(r.requiredPoints==null?'金額を算出できません':`${r.requiredPoints.toLocaleString('ja-JP')}P必要 · 現金支払額は要確認`):r.total==null?'正確な料金を確認できていません':`月額換算 ${yen(r.monthly)}`}</small><span class="status ${r.status}">${labels[r.status]}</span></div><div class="result-extra"><p>${s.type==='subscription'&&r.initial!=null?`契約時の請求額 ${yen(r.initial)}<br>更新後の請求額：要確認<br>`:''}${escape(r.reason)}</p><a href="/services/${s.id}/">料金表・更新・解約条件を確認 ↗</a></div></article>`).join('');
}
if(form){
 try{
 catalog=await fetch('/data/services.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('data');return r.json()});
 await render();
 form.addEventListener('change',async event=>{
   if(event.target.name==='purpose'){
     if(event.target.value==='short')form.elements.months.value='1';
     if(event.target.value==='options')form.elements.option.value='premium';
     else form.elements.option.value='none';
     if(event.target.value==='cost')form.elements.sort.value='total';
   }
   await render();
 });
 form.addEventListener('submit',async event=>{event.preventDefault();if(!form.reportValidity())return;await render();document.querySelector('.results-head').scrollIntoView({behavior:'smooth',block:'start'})});
 form.addEventListener('reset',()=>setTimeout(render,0));
 }catch{document.querySelector('#results').innerHTML='<p class="empty-result">料金データを読み込めませんでした。ページを再読み込みするか、下の各サービス詳細で料金表をご確認ください。</p>'}
}
const dialog=document.querySelector('#age-dialog');let adultAcknowledged=false,pendingUrl;
for(const link of document.querySelectorAll('[data-adult-link]'))link.addEventListener('click',event=>{if(adultAcknowledged)return;event.preventDefault();pendingUrl=link.href;dialog.showModal()});
dialog?.addEventListener('close',()=>{if(dialog.returnValue==='yes'&&pendingUrl){adultAcknowledged=true;const url=pendingUrl;pendingUrl=null;window.location.assign(url)}else pendingUrl=null});
// Advertising is intentionally not loaded. No approved tag exists in the initial release.
// Enabling an ad requires a reviewed provider-specific module, policy update and CSP update.
