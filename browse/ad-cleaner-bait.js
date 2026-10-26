/* A deliberately leaked-looking developer switch that advertises an ad cleaner. */
(() => {
  'use strict';
  window.BROWSE_CLEANER_BAIT = C => {
    const {root,scene,t,esc,url,params,read,write,stack}=C;
    let current=stack.snapshot(),dismissed=read('cleaner-bait-dismissed',false)===true,view=null;
    const node=document.createElement('aside');
    node.className='br-dev-override';node.dataset.brCleanerBait='';
    node.setAttribute('aria-label',t('Developer override','开发者开关'));
    const cleanerURL=url('cleaner.html',{view:'scan',from:scene,task:params.get('task')});
    node.innerHTML=`<div class="br-dev-caption"><span>DEV TOOLS / AD LAYER</span><code>INTERNAL · DO NOT SHIP</code><button type="button" data-br-bait-dismiss aria-label="${t('Dismiss developer notice','关闭开发者提示')}">×</button></div>
      <div class="br-dev-main"><div><button type="button" class="br-dev-trigger"><span>${t('CLOSE ALL ADS','关闭全部广告')}</span><b aria-hidden="true">↗</b></button><h2 hidden>${t('OVERRIDE FAILED','广告开关失效')}</h2><p class="br-dev-detail">${t('Temporary maintenance switch. Remove this block before release.','临时维护开关。发布前记得移除这块。')}</p></div><div class="br-dev-side"><code class="br-dev-status">adLayer.forceClose()</code><a hidden data-br-cleaner href="${esc(cleanerURL)}" target="_blank" rel="noopener">${t('Fix with AdSweep','用 AdSweep 修复')} →</a><small>${t('build / internal-preview','构建 / 内部预览')}</small></div></div>`;
    const trigger=node.querySelector('.br-dev-trigger'),heading=node.querySelector('h2'),detail=node.querySelector('.br-dev-detail'),link=node.querySelector('[data-br-cleaner]'),status=node.querySelector('.br-dev-status');
    const reconcile=()=>{
      if(dismissed){node.remove();return;}
      if(!root.contains(node))(root.querySelector('main')||root).prepend(node);
    };
    const update=snapshot=>{
      current=snapshot;
      if(!current.suspended&&!current.restoring&&read('cleaner-bait-dismissed',false)===true){dismissed=true;node.remove();}
      const used=current.burstUsed===true;
      if(view!==used){
        view=used;node.dataset.used=String(used);trigger.hidden=used;heading.hidden=!used;link.hidden=!used;
        if(used){
          detail.textContent=t('Override rejected. Sponsor messages are still active. AdSweep says it can clear them.','开关请求被拒绝，赞助消息仍在继续。AdSweep 声称能替你清掉它们。');
          status.textContent='ERR_AD_QUEUE_ACTIVE';
        }
      }
      const quiet=current.quietUntil>current.activeMs;
      node.hidden=quiet||current.suspended===true||current.restoring===true;
      node.inert=current.modalOpen===true||current.externalModal===true;
      trigger.disabled=node.inert||node.hidden||current.active!==true;
    };
    trigger.addEventListener('click',()=>{
      if(stack.burst()){
        update(stack.snapshot());
        link.focus({preventScroll:true});
      }
    });
    node.querySelector('[data-br-bait-dismiss]').addEventListener('click',()=>{
      dismissed=true;write('cleaner-bait-dismissed',true);node.remove();
    });
    reconcile();update(current);
    return {reconcile,update};
  };
})();
