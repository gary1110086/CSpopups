/* Exactly two replacements, ending at a fixed public homepage. No arbitrary URLs. */
(() => {
  'use strict';
  const destinations=Object.freeze({trip:'https://www.trip.com/',shop:'https://www.ikea.com/my/en/',games:'https://store.steampowered.com/'});
  const params=new URLSearchParams(location.search),lang=params.get('lang')==='zh'?'zh':'en';
  const t=(en,zh)=>lang==='zh'?zh:en,step=params.get('step'),target=params.get('target');
  const title=document.getElementById('hop-title'),status=document.getElementById('hop-status'),next=document.getElementById('hop-next');
  document.documentElement.lang=lang==='zh'?'zh-CN':'en';
  let timer=0,left=false;
  try{window.opener=null;}catch{}
  const valid=(step==='1'||step==='2')&&Object.hasOwn(destinations,target)&&params.getAll('step').length===1&&params.getAll('target').length===1;
  if(!valid){
    document.querySelector('.spinner').hidden=true;
    title.textContent=t('Link unavailable','链接不可用');status.textContent=t('Choose a website to continue.','请选择网站继续。');
    next.href='launch.html?lang='+lang+'&v=corn1';next.textContent=t('Website chooser','网站入口');next.hidden=false;return;
  }
  const second=new URL('redirect-hop.html',location.href);
  second.search=new URLSearchParams({step:'2',target,lang,v:'corn1'}).toString();
  const destination=step==='1'?second.href:destinations[target];
  title.textContent=t(step==='1'?'Checking connection…':'Opening page…',step==='1'?'正在检查连接…':'正在打开页面…');
  document.title=title.textContent;
  status.textContent=t('Please wait a moment.','请稍候。');
  next.href=destination;next.textContent=t('Continue','继续');next.hidden=false;
  const go=()=>{if(left)return;left=true;clearTimeout(timer);location.replace(destination);};
  next.addEventListener('click',event=>{if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();go();});
  const schedule=()=>{clearTimeout(timer);left=false;timer=setTimeout(go,step==='1'?700:850);};
  window.addEventListener('pagehide',()=>{left=true;clearTimeout(timer);});
  window.addEventListener('pageshow',event=>{if(event.persisted)schedule();});
  schedule();
})();
