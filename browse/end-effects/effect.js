(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const canvas = $('fx'), ctx = canvas.getContext('2d', {alpha:true});
  const stage = $('stage'), result = $('result'), caption = $('caption'), wash = $('wash');
  const TAU = Math.PI * 2, rand = (a,b) => a + Math.random() * (b-a);
  const clamp = (n,a=0,b=1) => Math.max(a,Math.min(b,n));
  const ease = n => 1-Math.pow(1-clamp(n),3);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const volume = window.NuclearVolume;
  const embed = location.pathname.endsWith('/ending-player.html');
  const options = new URLSearchParams(location.search);
  const en = options.get('lang') === 'en';
  const WARNING_SECONDS = 1.5;
  let soundGeneration = 0;
  let W=0,H=0,scale=1,raf=0,run=null,lastMode='nuke',voices=[];
  let bits=[],embers=[],cloud=[],rockets=[],sparks=[],confetti=[],nextRocket=0,lastTime=0;
  const colors=['#dcff78','#ffbc66','#ff7198','#89cfff','#e6c8ff','#fff2b4'];
  function resize(){
    W=innerWidth;H=innerHeight;scale=Math.min(W/1400,H/860);
    const dpr=Math.min(devicePixelRatio||1,1.6);
    canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  addEventListener('resize',resize);resize();

  // Soft original billow textures, generated once and reused throughout the shot.
  function smokeTexture(type){
    const c=document.createElement('canvas');c.width=c.height=160;const p=c.getContext('2d');
    const palette=type==='fire'?['255,246,190','255,174,54','230,70,12']:
      type==='hot'?['241,168,85','137,71,38','54,37,32']:['149,135,119','75,67,61','24,25,24'];
    for(let i=0;i<85;i++){
      const a=rand(0,TAU),r=rand(0,47),x=80+Math.cos(a)*r,y=80+Math.sin(a)*r;
      const s=rand(12,40)*(1-r/100),g=p.createRadialGradient(x-s*.12,y-s*.2,0,x,y,s);
      g.addColorStop(0,`rgba(${palette[0]},.32)`);g.addColorStop(.45,`rgba(${palette[1]},.38)`);
      g.addColorStop(.75,`rgba(${palette[2]},.26)`);g.addColorStop(1,`rgba(${palette[2]},0)`);
      p.fillStyle=g;p.fillRect(x-s,y-s,s*2,s*2);
    }return c;
  }
  const smoke=smokeTexture('smoke'),hot=smokeTexture('hot'),fire=smokeTexture('fire');
  function puff(img,x,y,s,alpha=1,rotation=0,stretch=1){
    if(s<=0||alpha<=0)return;ctx.save();ctx.translate(x,y);ctx.rotate(rotation);ctx.globalAlpha=clamp(alpha);
    ctx.drawImage(img,-s,-s*stretch,s*2,s*2*stretch);ctx.restore();
  }
  function glow(x,y,r,rgb,alpha){
    if(r<=0||alpha<=0)return;
    const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${rgb},${clamp(alpha)})`);
    g.addColorStop(.3,`rgba(${rgb},${clamp(alpha)*.35})`);g.addColorStop(1,`rgba(${rgb},0)`);
    ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);
  }
  function stopSound(){
    soundGeneration++;
    for(const v of voices){v.el.pause();v.el.removeAttribute('src');v.el.load();}
    voices=[];
  }
  function sound(mode){
    stopSound();
    if(!$('sound').checked||!run||document.hidden)return;
    const own=soundGeneration;
    const track=(name,key,start)=>{
      const el=new Audio(new URL(name,location.href).href);el.preload='auto';
      const v={el,key,start,started:false,stopped:false};voices.push(v);
      // A late unmute/load seeks forward instead of replaying the alarm from zero.
      el.addEventListener('loadedmetadata',()=>{
        if(own!==soundGeneration||!run||!v.started||v.stopped)return;
        const offset=Math.max(0,(performance.now()-run.start)/1000-start);
        if(Number.isFinite(el.duration)&&offset<el.duration&&offset>.12)el.currentTime=offset;
      },{once:true});
    };
    if(mode==='nuke'){
      track('lazychillzone-air-raid-siren-2-227377.mp3','siren',0);
      track('professionalsfx-nuclear-explosion-507442.mp3','explosion',WARNING_SECONDS);
    }else track('u_mojdif8pzp-crowd-cheering-yelling-525147.mp3','cheer',0);
    syncSound((performance.now()-run.start)/1000);
  }
  function syncSound(t){
    if(!run||document.hidden)return;
    const own=soundGeneration;
    for(const v of voices){
      if(v.stopped)continue;
      const {el,key,start}=v;
      const end=key==='siren'?WARNING_SECONDS+.55:key==='explosion'?WARNING_SECONDS+8.6:12.8;
      if(t>=end){el.pause();v.stopped=true;continue;}
      const gain=key==='siren' ? .76*Math.exp(-Math.max(0,t-WARNING_SECONDS)*14) :
        (key==='explosion' ? .98 : .93)*clamp((end-t)/.9);
      el.volume=clamp(gain);
      if(t>=start&&!v.started){
        v.started=true;
        const offset=Math.max(0,t-start);
        if(el.readyState>=1&&offset>.12){
          if(Number.isFinite(el.duration)&&offset>=el.duration){v.stopped=true;continue;}
          el.currentTime=offset;
        }
        el.play().catch(error=>{
          if(own!==soundGeneration||v.stopped||error.name==='AbortError')return;
          const retry=$('audio-retry');if(retry)retry.hidden=false;
        });
      }
    }
  }
  function reset(){
    cancelAnimationFrame(raf);raf=0;run=null;stopSound();bits=[];embers=[];cloud=[];rockets=[];sparks=[];confetti=[];
    ctx.clearRect(0,0,W,H);volume?.clear();wash.style.opacity=0;caption.style.opacity=0;
    stage.style.transform='';document.body.className='';result.hidden=true;result.classList.remove('visible');
    $('nuke').setAttribute('aria-pressed','false');$('win').setAttribute('aria-pressed','false');
  }
  function createDebris(){
    const paints=['#f1eee0','#df97b9','#daf56c','#5076e0','#b74129'];
    document.querySelectorAll('[data-break]').forEach((card,i)=>{
      const r=card.getBoundingClientRect();
      for(let y=r.top;y<r.bottom;y+=20)for(let x=r.left;x<r.right;x+=24){
        const dx=x-W*.5,dy=y-H*.57,a=Math.atan2(dy,dx),v=rand(210,830)*scale;
        bits.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-100*scale,w:rand(8,23)*scale,h:rand(5,17)*scale,
          a:rand(0,TAU),spin:rand(-9,9),color:Math.random()<.2?'#242820':paints[i],text:Math.random()<.045});
      }
    });
  }
  function prepareNuke(){
    createDebris();
    for(let i=0;i<180;i++)embers.push({a:rand(-Math.PI,0),v:rand(100,690),life:rand(1.4,5),s:rand(.7,2.8)});
    for(let i=0;i<135;i++)cloud.push({kind:i<95?'cap':'stem',a:rand(0,TAU),u:rand(0,1),
      seed:rand(0,TAU),s:rand(28,67),depth:rand(.5,1),spin:rand(-.1,.1)});
    cloud.sort((a,b)=>a.depth-b.depth);
  }
  function showResult(mode){
    if(!result.hidden)return;result.hidden=false;
    $('result-title').textContent=mode==='nuke'?'TIME’S UP.':'YOU SURVIVED!';
    $('result-copy').textContent=mode==='nuke'?'所有干扰，到此为止。':'你赢回了自己的注意力。';
    $('score-number').textContent=mode==='nuke'?'76':'100';
    if(embed){
      const score=Number(options.get('score'));
      $('score-number').textContent=options.has('score')&&Number.isFinite(score)&&score>=0&&score<=100?String(score):'—';
      $('result-title').textContent=mode==='nuke'?'TIME’S UP.':'ROUND COMPLETE!';
      $('result-copy').textContent=mode==='nuke'?(en?'All distractions end here.':'所有干扰，到此为止。'):(en?'Your round has been submitted.':'本轮已交卷。');
      $('again').textContent=en?'View results →':'查看成绩 →';
    }
    // Layout read permits the entry transition without an extra unmanaged timer.
    void result.offsetWidth;result.classList.add('visible');
  }
  function nuclear(t,dt){
    if(volume?.available){cinematicNuclear(t,dt);return;}
    const cx=W*.5,cy=H*.62,S=scale*1.16;
    const a=Math.max(0,t-.18),exp=ease(a/.8),fade=1-clamp((t-4.3)/2.3);
    const flash=clamp(1-Math.abs(t-.26)/.18)*.8;
    wash.style.opacity=flash;
    caption.textContent=t<1.1?'TIME LIMIT REACHED':'CLEARING THE NOISE';
    caption.style.opacity=t<2.6?clamp(t*4)*(1-clamp((t-2)/.6)):0;
    if(t<.18)return;
    document.body.classList.add('playing');
    const shake=Math.pow(1-clamp(a/1.4),2)*10*S;
    ctx.save();ctx.translate(Math.sin(t*87)*shake,Math.cos(t*69)*shake*.5);
    // Broad amber illumination, with a bright expanding nucleus.
    ctx.globalCompositeOperation='screen';
    glow(cx,cy,Math.max(W,H)*.9,'246,104,26',exp*.6*fade);
    glow(cx,cy,270*S*exp,'255,202,102',(1-clamp(a/2))*1);
    if(a<1.7){
      const radius=(30+Math.pow(a,.72)*950)*S;
      ctx.save();ctx.translate(cx,cy);ctx.scale(1,.35+a*.55);
      ctx.globalAlpha=(1-clamp(a/1.7))*.9;ctx.lineWidth=(28*(1-clamp(a/1.7))+2)*S;
      ctx.strokeStyle='#ffd6a0';ctx.beginPath();ctx.arc(0,0,radius,0,TAU);ctx.stroke();
      ctx.lineWidth=2;ctx.strokeStyle='#fff9e5';ctx.beginPath();ctx.arc(0,0,radius*.97,0,TAU);ctx.stroke();ctx.restore();
    }
    ctx.globalCompositeOperation='source-over';
    // A dust skirt spreads along the base before the rising cloud is built.
    for(let i=0;i<16;i++){
      const angle=i/16*TAU,spread=(50+a*175)*S;
      puff(hot,cx+Math.cos(angle)*spread,cy+Math.sin(angle)*spread*.13,
        (35+a*25)*S,Math.min(1,a*3)*fade*.55,angle,.5);
    }
    // Toroidal cap: lobes circulate outwards over a central rising column.
    const rise=ease(a/3.5)*285*S,capWidth=(35+ease(a/2.7)*205)*S;
    for(const p of cloud){
      let x,y,r,alpha;const swirl=p.a+a*(.23+p.u*.22);
      if(p.kind==='cap'){
        const radial=.3+Math.sqrt(p.u)*.7;
        x=cx+Math.cos(swirl)*capWidth*radial;
        y=cy-rise+Math.sin(swirl)*capWidth*.32*radial-Math.sin(p.u*Math.PI)*45*S;
        r=p.s*S*(.25+ease(a/1.9))*(.8+p.depth*.4);
        alpha=clamp(a*2.2)*fade*.86;
      }else{
        const height=p.u*rise;
        x=cx+Math.sin(p.seed+a*.65)*((1-p.u)*36+15)*S;
        y=cy-height;r=p.s*S*(.4+ease(a/1.4)*.6)*(1-p.u*.22);
        alpha=clamp(a*2)*fade*.66;
      }
      const cooling=clamp((a-1.2)/2.5);
      puff(a<.65?fire:hot,x,y,r,alpha,swirl*.4+p.spin*a);
      if(cooling>0)puff(smoke,x,y-5*S,r*1.12,alpha*cooling,swirl*.4);
      if(a<2.6&&p.depth>.75){ctx.globalCompositeOperation='screen';
        puff(fire,x,y+r*.25,r*.5,alpha*(1-clamp(a/2.6))*.8,p.seed);
        ctx.globalCompositeOperation='source-over';}
    }
    if(a<1.3){ctx.globalCompositeOperation='screen';
      puff(fire,cx,cy-rise*.3,(100+exp*80)*S,(1-clamp(a/1.3)),t*.2);
      glow(cx,cy-rise*.25,100*S*exp,'255,243,194',1-clamp(a/1.1));ctx.globalCompositeOperation='source-over';}
    for(const b of bits){
      b.x+=b.vx*dt;b.y+=b.vy*dt;b.vx*=Math.exp(-dt*.6);b.vy+=220*S*dt;b.a+=b.spin*dt;
      const opacity=1-clamp((a-1.1)/1.5);if(opacity<=0)continue;
      ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.a);ctx.globalAlpha=opacity;
      ctx.fillStyle=b.color;ctx.fillRect(-b.w/2,-b.h/2,b.w,b.h);
      if(b.text){ctx.fillStyle='#fff';ctx.font=`${12*S}px monospace`;ctx.fillText('×',0,0);}ctx.restore();
    }
    ctx.globalCompositeOperation='screen';
    for(const p of embers){if(a>p.life)continue;
      const drag=(1-Math.exp(-a*.6))/.6,v=p.v*S;
      const x=cx+Math.cos(p.a)*v*drag,y=cy+Math.sin(p.a)*v*drag+80*S*a*a;
      ctx.globalAlpha=(1-a/p.life)*fade;ctx.strokeStyle='#ffc383';ctx.lineWidth=p.s*S;
      ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-Math.cos(p.a)*v*.018,y-Math.sin(p.a)*v*.018);ctx.stroke();
    }
    ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.restore();
    if(t>3.65)showResult('nuke');
  }

  function cinematicNuclear(t,dt){
    const a=Math.max(0,t-.15),cx=W*.5,cy=H*.7,S=scale;
    if(t>.15)document.body.classList.add('playing');
    // A single exposure pulse, then the hot volume slowly cools to opaque soot.
    wash.style.opacity=clamp(1-Math.abs(t-.23)/.14)*.86;
    caption.textContent='TIME LIMIT REACHED';caption.style.opacity=clamp(t*3)*(1-clamp((t-.8)/.5));
    volume.draw(t);
    const shake=Math.exp(-a*2.8)*9*S;
    const jitter=`translate(${Math.sin(a*95)*shake}px,${Math.cos(a*73)*shake*.6}px)`;
    document.getElementById('nuclear-volume').style.transform=jitter;
    if(a<.9){ctx.globalCompositeOperation='screen';
      glow(cx,cy,Math.max(W,H)*.8,'255,168,63',Math.exp(-a*4)*.28);
      ctx.globalCompositeOperation='source-over';}
    // Wide, fast ground-hugging dust front; avoid a perfect glowing cartoon ring.
    const dustAge=Math.max(0,a-.22),dustFade=clamp(dustAge*3)*(1-clamp((a-2.6)/2));
    for(let i=0;i<28;i++){
      const angle=i/28*TAU,spread=(60+dustAge*370)*S;
      const x=cx+Math.cos(angle)*spread,y=cy+Math.sin(angle)*spread*.16;
      puff(smoke,x,y,(30+dustAge*43)*S,dustFade*.45,angle*.3,.45);
    }
    for(const b of bits){
      b.x+=b.vx*dt;b.y+=b.vy*dt;b.vx*=Math.exp(-dt*.45);b.vy+=270*S*dt;b.a+=b.spin*dt;
      const fade=1-clamp((a-.6)/1.1);if(fade<=0)continue;
      ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.a);ctx.globalAlpha=fade*.8;
      ctx.fillStyle=a<.38?'#ffe0aa':b.color;ctx.fillRect(-b.w*.4,-b.h*.4,b.w*.8,b.h*.8);ctx.restore();
    }
    ctx.globalCompositeOperation='screen';
    for(const p of embers){
      if(a>p.life)continue;const drag=(1-Math.exp(-a*.8))/.8,v=p.v*S*.55;
      const x=cx+Math.cos(p.a)*v*drag,y=cy+Math.sin(p.a)*v*drag+70*S*a*a;
      ctx.globalAlpha=(1-a/p.life)*.65;ctx.strokeStyle='#ffb468';ctx.lineWidth=p.s*S*.6;
      ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-Math.cos(p.a)*v*.018,y-Math.sin(p.a)*v*.018);ctx.stroke();
    }
    ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
    if(t>4.4)showResult('nuke');
  }

  function launchRocket(t,forceX){
    const x=forceX??rand(.08,.92)*W,tx=clamp(x+rand(-160,160)*scale,50,W-50),ty=rand(.1,.43)*H;
    rockets.push({x,y:H+20,ox:x,tx,ty,start:t,travel:rand(.55,1),color:colors[Math.floor(rand(0,colors.length))]});
  }
  function burst(x,y,color,t){
    const count=170;
    for(let i=0;i<count;i++){
      const a=i/count*TAU+rand(-.025,.025),speed=rand(115,340)*scale;
      sparks.push({x,y,px:x,py:y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,color,
        age:0,life:rand(1.1,2.3),width:rand(1,2.4),twinkle:rand(0,TAU)});
    }
    for(let i=0;i<35;i++){
      const a=rand(0,TAU),v=rand(20,100)*scale;
      sparks.push({x,y,px:x,py:y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,color:'#fff6ce',age:0,life:rand(.3,.7),width:2,twinkle:0});
    }
  }
  function addConfetti(count,origin){
    for(let i=0;i<count;i++){
      const side=Math.random()<.5,from=origin==='sides';
      confetti.push({x:from?(side?-20:W+20):rand(0,W),y:from?H*.9:rand(-H*.8,-20),
        vx:from?(side?1:-1)*rand(130,600)*scale:rand(-55,55),vy:from?-rand(250,750)*scale:rand(60,190),
        w:rand(4,10)*Math.max(.7,scale),h:rand(3,6)*Math.max(.7,scale),a:rand(0,TAU),spin:rand(-8,8),
        phase:rand(0,TAU),color:colors[Math.floor(rand(0,colors.length))],age:0,life:rand(5,8)});
    }
  }
  function victory(t,dt){
    if(t>=nextRocket&&t<7.2){
      const batch=t<.5?6:3;
      for(let i=0;i<batch;i++)launchRocket(t);
      nextRocket=t+rand(.28,.5);
    }
    if(run.lastRain<t-.4&&t<5.7){addConfetti(80);run.lastRain=t;}
    ctx.globalCompositeOperation='screen';
    for(let i=rockets.length-1;i>=0;i--){
      const r=rockets[i],progress=clamp((t-r.start)/r.travel);
      const oldX=r.x,oldY=r.y;r.x=r.ox+(r.tx-r.ox)*progress;r.y=H+20+(r.ty-H-20)*(1-Math.pow(1-progress,1.6));
      ctx.strokeStyle=r.color;ctx.lineWidth=1.7*scale;ctx.globalAlpha=1-progress*.4;
      ctx.beginPath();ctx.moveTo(oldX,Math.min(H,oldY+30));ctx.lineTo(r.x,r.y);ctx.stroke();
      glow(r.x,r.y,12*scale,'255,230,170',.85);
      if(progress>=1){burst(r.tx,r.ty,r.color,t);rockets.splice(i,1);}
    }
    for(let i=sparks.length-1;i>=0;i--){
      const p=sparks[i];p.age+=dt;if(p.age>p.life){sparks.splice(i,1);continue;}
      p.px=p.x;p.py=p.y;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.exp(-dt*.75);p.vy=p.vy*Math.exp(-dt*.5)+62*scale*dt;
      const alpha=Math.pow(1-p.age/p.life,.7);
      ctx.globalAlpha=alpha*(.8+.2*Math.sin(p.age*35+p.twinkle));ctx.strokeStyle=p.color;ctx.lineWidth=p.width*scale;
      ctx.beginPath();ctx.moveTo(p.px-p.vx*.024,p.py-p.vy*.024);ctx.lineTo(p.x,p.y);ctx.stroke();
    }
    ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
    for(let i=confetti.length-1;i>=0;i--){
      const p=confetti[i];p.age+=dt;if(p.age>p.life||p.y>H+40){confetti.splice(i,1);continue;}
      p.x+=(p.vx+Math.sin(p.age*3+p.phase)*22)*dt;p.y+=p.vy*dt;
      p.vx*=Math.exp(-dt*1.1);p.vy=Math.min(200*scale,p.vy+190*scale*dt);p.a+=p.spin*dt;
      ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.a);ctx.scale(Math.cos(p.age*7+p.phase),1);
      ctx.globalAlpha=clamp((p.life-p.age)/1.1)*.9;ctx.fillStyle=p.color;ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore();
    }
    caption.textContent='YOU BEAT THE DISTRACTIONS';caption.style.opacity=t<1.2?ease(t*2)*(1-clamp((t-.7)/.5)):0;
    if(t>1.35)showResult('win');
  }
  function frame(now){
    if(!run)return;const t=(now-run.start)/1000,dt=Math.min((now-lastTime)/1000,.04);lastTime=now;
    ctx.clearRect(0,0,W,H);
    syncSound(t);
    if(run.mode==='nuke'&&t<WARNING_SECONDS){
      caption.textContent=en?'TIME’S UP · TAKE COVER':'时间到 · 警报';
      caption.style.opacity=String(.65+Math.sin(t*3)*.2);
      wash.style.opacity=0;
    }else if(run.reduced){
      caption.style.opacity=0;
      if(t>.25){document.body.classList.add('playing');showResult(run.mode);}
    }else if(run.mode==='nuke')nuclear(t-WARNING_SECONDS,dt);else victory(t,dt);
    if(t<(run.mode==='nuke'?WARNING_SECONDS+8.6:13))raf=requestAnimationFrame(frame);
    else{stopSound();ctx.clearRect(0,0,W,H);volume?.clear();wash.style.opacity=0;caption.style.opacity=0;raf=0;
      if(embed&&parent!==window)parent.postMessage({type:'close-popups:ending-done'},location.origin);}
  }
  function play(mode){
    reset();lastMode=mode;
    run={mode,start:performance.now(),lastRain:0,reduced:reduced.matches};lastTime=run.start;nextRocket=0;
    document.body.classList.add('settling');if(mode==='win')document.body.classList.add('win');
    $(mode==='win'?'win':'nuke').setAttribute('aria-pressed','true');
    if(mode==='nuke')prepareNuke();else{addConfetti(700,'sides');addConfetti(250);}
    sound(mode);raf=requestAnimationFrame(frame);
  }
  $('nuke').onclick=()=>play('nuke');$('win').onclick=()=>play('win');
  $('again').onclick=()=>{if(embed&&parent!==window)parent.postMessage({type:'close-popups:ending-done'},location.origin);else play(lastMode);};$('reset').onclick=reset;
  $('sound').onchange=()=>{if(!$('sound').checked)stopSound();else if(run)sound(lastMode);};
  $('fullscreen').onclick=async()=>{
    try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}
    catch{$('fullscreen').textContent='请按 F11 全屏';}
  };
  addEventListener('keydown',e=>{if(e.key==='Escape')reset();});
  addEventListener('pagehide',reset);
  // Hidden previews stop their sound; elapsed animation time is never a score clock.
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopSound();else if(run&&raf)sound(lastMode);});
  if($('audio-retry'))$('audio-retry').onclick=()=>{$('audio-retry').hidden=true;sound(lastMode);};
  if(embed){
    $('sound').checked=options.get('sound')!=='0';
    play(options.get('mode')==='win'?'win':'nuke');
  }
})();
