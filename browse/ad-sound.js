/* Original, short Web Audio cues for the Browse advertisements. */
(()=>{
  window.BROWSE_AD_SOUND=C=>{
    const KEY='ad-sound-v1';
    const readPreference=()=>{
      const saved=C.read(KEY,{enabled:true});
      return {enabled:typeof saved?.enabled==='boolean'?saved.enabled:true};
    };
    let preference=readPreference();
    let state={active:false,activeMs:0,quietUntil:0,modalOpen:false,suspended:false,restoring:false};
    let context=null,master=null,armed=false,resuming=null,destroyed=false,pageSuspended=false;
    let restoreFrame=0,restoreGeneration=0,lastCueAt=-Infinity,burstUntil=0;
    const voices=new Set();
    const button=document.createElement('button');
    button.type='button';
    button.className='br-ad-sound';
    button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4Z"/><path class="br-sound-waves" d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/><path class="br-sound-cross" d="m16 9 6 6m0-6-6 6"/></svg><span></span>';
    const label=button.querySelector('span');
    document.body.append(button);

    function available(){
      return !destroyed&&!pageSuspended&&!state.suspended&&!state.restoring&&
        state.active&&!state.modalOpen&&state.activeMs>=state.quietUntil&&
        !document.hidden&&document.hasFocus();
    }
    function canPlay(){return preference.enabled&&available()&&context?.state==='running';}
    function paint(){
      const ready=armed&&context?.state==='running';
      button.dataset.enabled=String(preference.enabled);
      button.dataset.ready=String(Boolean(ready));
      button.setAttribute('aria-pressed',String(preference.enabled));
      button.setAttribute('aria-label',preference.enabled?C.t('Mute advertisement sounds','关闭广告声音'):C.t('Enable advertisement sounds','开启广告声音'));
      label.textContent=preference.enabled?C.t('Ad sound: on','广告声音：开'):C.t('Ad sound: off','广告声音：关');
      button.title=preference.enabled&&!ready
        ?C.t('After a click or key press, new advertisements can play short sounds. Click here to mute.','点击网页或按键后，新的广告会播放短提示音。点击此处关闭。')
        :preference.enabled?C.t('Mute all advertisement cues','关闭所有广告提示音'):C.t('Enable short advertisement cues','开启短广告提示音');
      button.disabled=pageSuspended||state.suspended||state.restoring||state.modalOpen;
    }
    function stopVoices(){
      for(const voice of voices){voice.oscillator.stop();voice.envelope.disconnect();}
      voices.clear();
    }
    function pause(){
      stopVoices();
      if(context?.state==='running')context.suspend();
      paint();
    }
    function resume(){
      if(!context||!armed||!preference.enabled||!available())return Promise.resolve(false);
      if(context.state==='running'){paint();return Promise.resolve(true);}
      if(resuming)return resuming;
      resuming=context.resume().then(()=>{
        // A tab can lose focus while the browser is granting audio activation.
        if(!available()||!preference.enabled){pause();return false;}
        paint();
        return context.state==='running';
      }).catch(()=>false).finally(()=>{resuming=null;});
      return resuming;
    }
    function unlock(event){
      if(!event.isTrusted||!preference.enabled||!available())return Promise.resolve(false);
      if(!context){
        context=new AudioContext();
        master=context.createGain();
        master.gain.value=1;
        master.connect(context.destination);
        context.addEventListener('statechange',paint);
      }
      armed=true;
      return resume();
    }
    function sync(){
      if(!preference.enabled||!available())pause();
      else if(armed)resume();
      paint();
    }
    function phrase(kind,site){
      if(!canPlay())return false;
      const clock=performance.now();
      if(kind==='arrival'&&(clock<burstUntil||clock-lastCueAt<900))return false;
      lastCueAt=clock;
      const warning=['security','player','software','parcel'].includes(site);
      const notes=kind==='burst'?[392,523.25,659.25]:warning?[659.25,440]:[523.25,659.25];
      const start=context.currentTime+.008;
      notes.forEach((frequency,index)=>{
        const oscillator=context.createOscillator();
        const envelope=context.createGain();
        const at=start+index*.105;
        oscillator.type='sine';
        oscillator.frequency.value=frequency;
        envelope.gain.setValueAtTime(0,at);
        envelope.gain.linearRampToValueAtTime(kind==='burst'?.045:.035,at+.009);
        envelope.gain.exponentialRampToValueAtTime(.0001,at+.14);
        envelope.gain.setValueAtTime(0,at+.15);
        oscillator.connect(envelope);
        envelope.connect(master);
        const voice={oscillator,envelope};
        voices.add(voice);
        oscillator.addEventListener('ended',()=>{
          voices.delete(voice);
          oscillator.disconnect();
          envelope.disconnect();
        },{once:true});
        oscillator.start(at);
        oscillator.stop(at+.16);
      });
      return true;
    }
    function gesture(event){unlock(event);}
    function toggle(event){
      preference={...readPreference(),enabled:!preference.enabled};
      C.write(KEY,preference);
      if(preference.enabled){
        unlock(event).then(ready=>{if(ready)phrase('preview');});
      }else pause();
      paint();
    }
    function onPageHide(){
      pageSuspended=true;
      restoreGeneration++;
      cancelAnimationFrame(restoreFrame);
      pause();
    }
    function onPageShow(event){
      if(!event.persisted)return;
      pageSuspended=true;
      const generation=++restoreGeneration;
      cancelAnimationFrame(restoreFrame);
      // Match the ad stack's authoritative, two-frame BFCache reconciliation.
      restoreFrame=requestAnimationFrame(()=>{
        restoreFrame=requestAnimationFrame(()=>{
          if(destroyed||generation!==restoreGeneration)return;
          preference=readPreference();
          pageSuspended=false;
          sync();
        });
      });
    }
    button.addEventListener('click',toggle);
    document.addEventListener('pointerdown',gesture,true);
    document.addEventListener('keydown',gesture,true);
    document.addEventListener('visibilitychange',sync);
    window.addEventListener('blur',sync);
    window.addEventListener('focus',sync);
    window.addEventListener('pagehide',onPageHide);
    window.addEventListener('pageshow',onPageShow);
    paint();

    return {
      host:button,
      update(next){state=next;sync();},
      arrival(item){
        preference=readPreference();
        sync();
        // The stack calls this only for new pending cards, never restored cards.
        // Locked, muted and background arrivals have no deferred playback.
        return phrase('arrival',item.site);
      },
      burst(){
        burstUntil=performance.now()+1200;
        stopVoices();
        return phrase('burst');
      },
      destroy(){
        destroyed=true;
        restoreGeneration++;
        cancelAnimationFrame(restoreFrame);
        stopVoices();
        button.removeEventListener('click',toggle);
        document.removeEventListener('pointerdown',gesture,true);
        document.removeEventListener('keydown',gesture,true);
        document.removeEventListener('visibilitychange',sync);
        window.removeEventListener('blur',sync);
        window.removeEventListener('focus',sync);
        window.removeEventListener('pagehide',onPageHide);
        window.removeEventListener('pageshow',onPageShow);
        button.remove();
        if(context){context.removeEventListener('statechange',paint);context.close();}
      }
    };
  };
})();
