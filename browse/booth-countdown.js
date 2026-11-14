/* Original urgency cues. This controller never changes round records or timing. */
(() => {
  'use strict';
  window.BROWSE_COUNTDOWN_SOUND = ({button,readRound,isLive,lang}) => {
    const KEY='br-booth-audio-v1',Audio=window.AudioContext||window.webkitAudioContext;
    const t=(en,zh)=>lang==='zh'?zh:en;
    const readPreference=()=>{try{const saved=JSON.parse(sessionStorage.getItem(KEY));return typeof saved?.enabled==='boolean'?saved.enabled:true;}catch{return true;}};
    let enabled=readPreference(),context=null,paused=false,destroyed=false,nextAt=0;
    const voices=new Set();
    const available=()=>{
      const r=readRound();
      return !destroyed&&!paused&&isLive()&&!document.hidden&&document.hasFocus()&&r?.status==='running'&&Date.now()<r.deadline;
    };
    const paint=()=>{
      if(destroyed)return;
      const ready=context?.state==='running';
      button.disabled=!Audio;
      button.dataset.enabled=String(enabled);
      button.dataset.audioState=!Audio?'unavailable':!enabled?'muted':ready?'ready':'locked';
      button.setAttribute('aria-pressed',String(enabled));
      button.textContent=!Audio?t('Timer sound unavailable','倒计时音不可用'):!enabled?t('Timer sound: off','倒计时音：关'):ready?t('Timer sound: on','倒计时音：开'):t('Enable timer sound','启用倒计时音');
      button.title=!enabled?t('Enable the final 10-second countdown sound','开启最后10秒倒计时音'):!ready?t('Click to enable the final 10-second countdown sound','点击启用最后10秒倒计时音'):t('Mute the countdown sound. The clock will keep running.','关闭倒计时音，计时仍会继续。');
      button.setAttribute('aria-label',button.textContent);
    };
    const stopVoices=()=>{
      for(const voice of voices){try{voice.oscillator.stop();}catch{}voice.oscillator.disconnect();voice.envelope.disconnect();}
      voices.clear();nextAt=0;
    };
    const silence=()=>{
      stopVoices();
      if(context?.state==='running')context.suspend().catch(()=>{});
      paint();
    };
    const prepare=()=>{
      if(!Audio||!enabled||!available())return;
      try {
        if(!context){context=new Audio({latencyHint:'interactive'});context.addEventListener('statechange',paint);}
        // Retry on trusted gestures even if an earlier autoplay resume is pending.
        if(context.state!=='running')context.resume().then(()=>{if(!available()||!enabled)silence();else paint();}).catch(()=>{});
        paint();
      } catch {paint();}
    };
    const gesture=event=>{if(event.isTrusted&&!button.contains(event.target))prepare();};
    const focus=()=>{if(available()&&enabled)prepare();else silence();};
    const toggle=()=>{
      if(destroyed||paused||!isLive())return;
      if(!enabled||context?.state!=='running'){enabled=true;prepare();}else{enabled=false;silence();}
      try{sessionStorage.setItem(KEY,JSON.stringify({enabled}));}catch{}
      paint();
    };
    const pulse=left=>{
      const progress=Math.max(0,Math.min(1,(10000-left)/10000)),at=context.currentTime+.005;
      const oscillator=context.createOscillator(),envelope=context.createGain(),voice={oscillator,envelope};
      oscillator.type='triangle';oscillator.frequency.value=880+220*progress;
      envelope.gain.setValueAtTime(0,at);
      envelope.gain.linearRampToValueAtTime(.08+.22*progress,at+.006);
      envelope.gain.exponentialRampToValueAtTime(.0001,at+.085);
      envelope.gain.setValueAtTime(0,at+.095);
      oscillator.connect(envelope);envelope.connect(context.destination);voices.add(voice);
      oscillator.addEventListener('ended',()=>{voices.delete(voice);oscillator.disconnect();envelope.disconnect();},{once:true});
      oscillator.start(at);oscillator.stop(at+.1);
    };
    button.addEventListener('click',toggle);
    document.addEventListener('pointerdown',gesture,true);
    document.addEventListener('keydown',gesture,true);
    document.addEventListener('visibilitychange',focus);
    window.addEventListener('blur',focus);window.addEventListener('focus',focus);
    paint();prepare();
    return {
      tick(record){
        if(!enabled||!available()){if(voices.size||context?.state==='running')silence();return;}
        const left=record.deadline-Date.now();
        if(left>10000||left<=0){if(voices.size)stopVoices();nextAt=0;return;}
        if(context?.state!=='running')return;
        const now=performance.now();if(now<nextAt)return;
        pulse(left);
        // At most one cue per tick; a resumed tab never replays missed beats.
        nextAt=now+(left>5000?1000:left>3000?500:250);
      },
      pause(){paused=true;silence();},
      resume(){paused=false;enabled=readPreference();if(enabled)prepare();else silence();paint();},
      destroy(){
        if(destroyed)return;destroyed=true;stopVoices();
        button.removeEventListener('click',toggle);
        document.removeEventListener('pointerdown',gesture,true);document.removeEventListener('keydown',gesture,true);
        document.removeEventListener('visibilitychange',focus);window.removeEventListener('blur',focus);window.removeEventListener('focus',focus);
        if(context){context.removeEventListener('statechange',paint);context.close().catch(()=>{});}
      }
    };
  };
})();
