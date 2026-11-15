/* Presentation only. Round evidence, timestamps and scoring never depend on this file. */
(() => {
  'use strict';
  const base=new URL('end-effects/ending-player.html',document.currentScript.src);
  const TICKET='br-booth-ending-next-v1';
  let dismiss=null;
  window.BROWSE_BOOTH_ENDING={
    result(round,score){
      if(dismiss||round?.status!=='ended'||!['timeout','submitted'].includes(round.reason))return;
      let ticket;
      try{
        ticket=JSON.parse(sessionStorage.getItem(TICKET));sessionStorage.removeItem(TICKET);
        if(ticket?.id!==round.id||ticket.reason!==round.reason||!Number.isFinite(ticket.at)||
           Date.now()-ticket.at<0||Date.now()-ticket.at>30000||sessionStorage.getItem('br-booth-ending-seen-v1:'+round.id))return;
        sessionStorage.setItem('br-booth-ending-seen-v1:'+round.id,'1');
      }catch{return;}
      const en=round.lang==='en',previous=document.activeElement;
      const dialog=document.createElement('dialog');dialog.setAttribute('aria-label',en?'Round ending':'本轮结束动画');
      dialog.style.cssText='position:fixed;inset:0;width:100vw;height:100dvh;max-width:none;max-height:none;margin:0;padding:0;border:0;background:#10120e;color:white;overflow:hidden';
      const frame=document.createElement('iframe');frame.title=en?'Round ending animation':'本轮结束动画';
      frame.allow='autoplay';frame.style.cssText='width:100%;height:100%;border:0;display:block';
      const url=new URL(base);url.searchParams.set('mode',round.reason==='timeout'?'nuke':'win');
      url.searchParams.set('lang',en?'en':'zh');url.searchParams.set('v','ending3');
      if(typeof score?.total==='number'&&Number.isFinite(score.total))url.searchParams.set('score',String(score.total));
      try{if(JSON.parse(sessionStorage.getItem('br-booth-audio-v1'))?.enabled===false)url.searchParams.set('sound','0');}catch{}
      frame.src=url.href;
      const skip=document.createElement('button');skip.type='button';skip.textContent=en?'Skip animation · View results →':'跳过动画 · 查看成绩 →';
      skip.style.cssText='position:absolute;top:24px;right:28px;z-index:100;padding:12px 18px;border:1px solid #8b977b;background:#171b16e8;color:#f3f0df;font:13px sans-serif;cursor:pointer';
      let timer=0;
      const message=e=>{if(e.origin===location.origin&&e.source===frame.contentWindow&&e.data?.type==='close-popups:ending-done')close();};
      const close=()=>{
        if(!dismiss)return;dismiss=null;clearTimeout(timer);window.removeEventListener('message',message);
        frame.src='about:blank';if(dialog.open)dialog.close();dialog.remove();
        if(previous?.isConnected)previous.focus();else document.querySelector('#booth-title')?.focus();
      };
      dismiss=close;skip.onclick=close;
      dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
      dialog.append(frame,skip);document.body.append(dialog);window.addEventListener('message',message);
      try{dialog.showModal();skip.focus();timer=setTimeout(close,15000);}catch{close();}
    }
  };
  window.addEventListener('pagehide',()=>dismiss?.());
})();
