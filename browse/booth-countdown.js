/* Selected voice/clock mix. Audio follows the deadline; it never writes round data. */
(() => {
  'use strict';
  const SOUND_URL=new URL('assets/booth-countdown-mix1.mp3',document.currentScript?.src||location.href).href;
  const WINDOW_MS=15000;
  window.BROWSE_COUNTDOWN_SOUND = ({button,readRound,isLive,lang}) => {
    const KEY='br-booth-audio-v1',Audio=window.AudioContext||window.webkitAudioContext;
    const t=(en,zh)=>lang==='zh'?zh:en;
    const readPreference=()=>{try{const value=JSON.parse(sessionStorage.getItem(KEY));return typeof value?.enabled==='boolean'?value.enabled:true;}catch{return true;}};
    let enabled=readPreference(),context=null,buffer=null,loading=null,abort=null,loadError=false;
    let paused=false,destroyed=false,loadGeneration=0,voice=null;
    const available=()=>{
      const r=readRound();
      return !destroyed&&!paused&&isLive()&&!document.hidden&&document.hasFocus()&&r?.status==='running'&&Date.now()<r.deadline;
    };
    const paint=()=>{
      if(destroyed)return;
      const ready=context?.state==='running';
      const state=!Audio?'unavailable':!enabled?'muted':loadError?'error':!ready?'locked':!buffer?'loading':'ready';
      button.disabled=!Audio;button.dataset.enabled=String(enabled);button.dataset.audioState=state;
      button.setAttribute('aria-pressed',String(enabled));
      button.textContent=state==='unavailable'?t('Timer sound unavailable','倒计时音不可用'):state==='muted'?t('Timer sound: off','倒计时音：关'):state==='error'?t('Retry timer sound','重试倒计时音'):state==='locked'?t('Enable timer sound','启用倒计时音'):state==='loading'?t('Loading timer sound','正在加载倒计时音'):t('Timer sound: on','倒计时音：开');
      button.title=state==='error'?t('Sound could not load. Click to retry.','声音未能加载，点击重试。'):!enabled?t('Enable the final 15-second countdown sound','开启最后15秒倒计时音'):!ready?t('Click to enable the final 15-second countdown sound','点击启用最后15秒倒计时音'):t('Clock fades in at 15 seconds; voice joins at 10. Click to mute.','最后15秒渐入滴答声，最后10秒加入男声。点击关闭声音。');
      button.setAttribute('aria-label',button.textContent);
    };
    const stopVoice=()=>{
      if(!voice)return;
      const previous=voice;voice=null;
      try{previous.source.stop();}catch{}
      previous.source.disconnect();previous.gain.disconnect();
    };
    const silence=()=>{
      stopVoice();
      if(context?.state==='running'){
        const owner=context;
        // Focus can return before an asynchronous suspension settles.
        owner.suspend().then(()=>{if(owner===context&&enabled&&available())prepare();}).catch(()=>{});
      }
      paint();
    };
    const loadBuffer=retry=>{
      if(buffer||loading||(loadError&&!retry)||!context)return;
      const owner=context,generation=++loadGeneration;
      abort=new AbortController();loadError=false;
      loading=fetch(SOUND_URL,{signal:abort.signal,cache:'force-cache'})
        .then(response=>{if(!response.ok)throw Error('audio response');return response.arrayBuffer();})
        .then(bytes=>destroyed||generation!==loadGeneration?null:owner.decodeAudioData(bytes))
        .then(decoded=>{
          if(destroyed||generation!==loadGeneration)return;
          if(!decoded||!Number.isFinite(decoded.duration)||decoded.duration<14.95||decoded.duration>15.1)throw Error('audio duration');
          buffer=decoded;loading=null;abort=null;paint();tick(readRound());
        }).catch(()=>{
          if(destroyed||generation!==loadGeneration)return;
          loading=null;abort=null;loadError=true;paint();
        });
    };
    const prepare=(retry=false)=>{
      if(!Audio||!enabled||!available())return;
      try{
        if(!context){context=new Audio({latencyHint:'interactive'});context.addEventListener('statechange',paint);}
        loadBuffer(retry);
        // Attempt immediately and on trusted gestures; a pending autoplay request must not suppress a retry.
        if(context.state!=='running')context.resume().then(()=>{if(!available()||!enabled)silence();else{paint();tick(readRound());}}).catch(()=>{});
        paint();
      }catch{loadError=true;paint();}
    };
    function tick(record){
      if(!enabled||!available()){if(voice||context?.state==='running')silence();return;}
      const left=record.deadline-Date.now();
      if(left>WINDOW_MS||left<=0){stopVoice();return;}
      if(!buffer||context?.state!=='running')return;
      const offset=(WINDOW_MS-left)/1000;
      if(voice){
        const position=voice.offset+context.currentTime-voice.when;
        if(voice.deadline===record.deadline&&Math.abs(position-offset)<.20)return;
        stopVoice();
      }
      // After a late load/unmute/return, wait out a word's tail instead of speaking half a number.
      let seek=offset+.008;
      const fraction=seek-Math.floor(seek);
      if(seek>=5&&fraction>.055&&fraction<.66)seek=Math.floor(seek)+.66;
      if(seek>=15)return;
      const wait=seek-offset,when=context.currentTime+wait;
      const source=context.createBufferSource(),gain=context.createGain();
      source.buffer=buffer;source.connect(gain);gain.connect(context.destination);
      gain.gain.setValueAtTime(0,when);gain.gain.linearRampToValueAtTime(1,when+.012);
      const entry={source,gain,when,offset:seek,deadline:record.deadline};voice=entry;
      source.addEventListener('ended',()=>{if(voice===entry)voice=null;source.disconnect();gain.disconnect();},{once:true});
      source.start(when,seek,15-seek);
      source.stop(context.currentTime+left/1000);
    }
    const gesture=event=>{if(event.isTrusted&&!button.contains(event.target))prepare();};
    const focus=()=>{if(available()&&enabled)prepare();else silence();};
    const toggle=()=>{
      if(destroyed||paused||!isLive())return;
      if(!enabled||context?.state!=='running'||loadError){enabled=true;prepare(true);}else{enabled=false;silence();}
      try{sessionStorage.setItem(KEY,JSON.stringify({enabled}));}catch{}
      paint();
    };
    button.addEventListener('click',toggle);
    document.addEventListener('pointerdown',gesture,true);document.addEventListener('keydown',gesture,true);
    document.addEventListener('visibilitychange',focus);window.addEventListener('blur',focus);window.addEventListener('focus',focus);
    paint();prepare();
    return {
      tick,
      pause(){paused=true;silence();},
      resume(){paused=false;enabled=readPreference();if(enabled)prepare();else silence();paint();},
      destroy(){
        if(destroyed)return;destroyed=true;loadGeneration++;abort?.abort();stopVoice();
        button.removeEventListener('click',toggle);
        document.removeEventListener('pointerdown',gesture,true);document.removeEventListener('keydown',gesture,true);
        document.removeEventListener('visibilitychange',focus);window.removeEventListener('blur',focus);window.removeEventListener('focus',focus);
        if(context){context.removeEventListener('statechange',paint);context.close().catch(()=>{});}
      }
    };
  };
})();
