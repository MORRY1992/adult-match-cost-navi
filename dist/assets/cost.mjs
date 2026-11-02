const unknown = (reason) => ({status:'unknown',total:null,initial:null,monthly:null,renewal:null,reason});
export function calculate(service, input={}) {
  const {months=1,channel='web',billing='bundle',option='none',messages=20,profiles=20}=input;
  if(![1,3,6,12].includes(months)||!['web','ios','android'].includes(channel)||!['bundle','monthly'].includes(billing)) return unknown('入力条件を確認してください。');
  if(service.type==='points') {
    const p=service.points;
    if(!p?.channels?.includes(channel))return unknown('この決済経路のポイント料金は未確認です。');
    if(!Number.isInteger(messages)||!Number.isInteger(profiles)||messages<0||profiles<0||messages>10000||profiles>10000)return unknown('利用回数は0〜10,000の整数で入力してください。');
    const requiredPoints=(messages*p.send+profiles*p.profile)*months;
    return {...unknown('消費するポイントの換算です。購入単位・残高・特典で現金支払額が異なるため、実際の購入額は公式画面で確認してください。'),status:'conditional',requiredPoints,consumptionYen:requiredPoints*p.unitYen};
  }
  const period=billing==='monthly'?1:months;
  const base=service.pricing?.[channel]?.[period];
  if(!Number.isSafeInteger(base)||base<0)return unknown('この期間・決済経路の料金は要確認です。');
  let initial=base;
  if(option!=='none') {
    const opt=service.options?.find(o=>o.id===option);
    const extra=opt?.prices?.[period];
    if(!Number.isSafeInteger(extra)||extra<0)return unknown('このオプションの料金は要確認です。');
    initial=opt.bundle?.[channel]?.[period]??(base+extra);
  }
  const total=initial*(billing==='monthly'?months:1);
  return {status:billing==='monthly'&&months>1?'conditional':'verified',total,initial,monthly:total/months,renewal:null,reason:billing==='monthly'&&months>1?'現行1か月プランの料金が変わらず、必要回数継続する場合の試算です。更新時の実額を保証するものではありません。':'公式掲載の通常プラン料金を使用。通信費・未選択の追加課金は含みません。'};
}
