/* Original procedural cinematic volume. No downloaded footage or remote shaders. */
window.NuclearVolume = (() => {
  const canvas=document.createElement('canvas');canvas.id='nuclear-volume';
  canvas.setAttribute('aria-hidden','true');document.body.appendChild(canvas);
  const gl=canvas.getContext('webgl',{alpha:true,antialias:false,premultipliedAlpha:false,depth:false});
  if(!gl)return {available:false,clear(){},draw(){}};
  const vertex=`attribute vec2 position;void main(){gl_Position=vec4(position,0.,1.);}`;
  const fragment=`precision highp float;
uniform vec2 resolution;uniform float time;
float hash(vec3 p){p=fract(p*.3183099+vec3(.13,.27,.41));p*=19.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float n=.53*noise(p);p=p*2.03+vec3(7.1,3.8,1.7);n+=.27*noise(p);p=p*2.07+vec3(1,8,4);n+=.13*noise(p);return n+.07*noise(p*2.01);}
float density(vec3 p,float t){
 float grow=1.-exp(-t*1.1),rise=1.15*(1.-exp(-t*.58));
 float width=.33+grow*.96,cy=-.55+rise;
 // Roll the flow field around the cap's toroidal cross-section.
 vec3 q=p;float radial=length(p.xz),angle=atan(p.y-cy,radial-width*.55);
 q.y+=sin(angle+t*.7)*.16;q.xz*=1.+cos(angle+t*.7)*.12;
 float cap=1.-length((p-vec3(0,cy,0))/vec3(width,.43+grow*.27,width*.83));
 float stem=1.-length(vec3(p.x/(.14+grow*.17),(p.y-(-.95+rise*.53))/(.15+rise*.7),p.z/(.17+grow*.2)));
 float ball=1.-length((p-vec3(0,-.66,0))/(.12+.72*(1.-exp(-t*5.))));
 float shape=mix(ball,max(cap,stem*.82),smoothstep(.55,1.6,t));
 if(shape<-.4)return 0.;
 vec3 flow=q*4.1-vec3(0,t*.72,0);
 float turb=fbm(flow),detail=noise(q*10.4-vec3(0,t*.95,0));
 shape+=(turb-.5)*.55+(detail-.5)*.16;
 return max(0.,shape)*3.4*smoothstep(0.,.16,t);
}
void main(){
 float t=max(0.,time-.12);vec2 uv=(gl_FragCoord.xy/resolution-.5)*2.;uv.x*=resolution.x/resolution.y;
 vec3 ro=vec3(0.,.3,5.4);vec3 rd=normalize(vec3(uv*1.65, -4.));
 // Slowly drift forward; the cloud itself remains the dominant motion.
 ro.z-=.17*(1.-exp(-t*.7));
 vec3 sum=vec3(0.);float opacity=0.;float stepSize=.065;
 float jitter=hash(vec3(gl_FragCoord.xy,0.));
 float ray=3.05+jitter*stepSize;
 for(int i=0;i<78;i++){
  vec3 p=ro+rd*ray;float d=density(p,t);
  if(d>.012){
   float n=fbm(p*5.-vec3(0,t*.7,0));
   float cooling=smoothstep(.65,5.,t);
   float core=1.-smoothstep(.2,1.8,length((p-vec3(0,-.55,0))*vec3(.75,1.2,.75)));
   float heat=clamp((1.-cooling)*.92+core*.32-(n-.35)*.7,0.,1.);
   float lit=clamp((d-density(p+vec3(-.12,.17,.12),t))*1.8+.28,.08,1.);
   vec3 soot=mix(vec3(.085,.073,.067),vec3(.40,.34,.27),lit);
   soot+=vec3(.16,.045,.009)*core*(1.-cooling);
   vec3 flame=mix(vec3(.45,.033,.002),vec3(1.6,.36,.025),smoothstep(.2,.75,heat));
   flame=mix(flame,vec3(2.8,1.8,.72),smoothstep(.75,1.,heat));
   float fireMask=smoothstep(.48,.85,heat)*(1.-smoothstep(1.2,4.6,t));
   vec3 col=mix(soot,flame,fireMask);
   float absorb=1.-exp(-d*stepSize*5.7);
   sum+=(1.-opacity)*col*absorb;opacity+=(1.-opacity)*absorb;
   if(opacity>.985)break;
  }
  ray+=stepSize;
 }
 // Dust ring and a restrained atmospheric halo, both in perspective.
 vec2 ground=vec2(uv.x,(uv.y+.63)*4.8);float r=length(ground);
 float front=t*3.2;float ring=exp(-pow((r-front)/(.06+t*.12),2.))*exp(-t*1.5);
 float halo=exp(-length(uv-vec2(0,-.3))*2.9)*(1.-exp(-t*8.))*exp(-t*.75);
 sum+=vec3(1.,.44,.1)*(halo*.25+ring*.7)*(1.-opacity*.7);
 float finish=1.-smoothstep(5.3,8.,t);sum*=finish;opacity*=finish;
 float extra=(halo*.38+ring*.8)*finish;
 float alpha=clamp(opacity+extra,0.,1.);
 vec3 rgb=1.-exp(-sum*1.5);
 gl_FragColor=vec4(rgb/max(alpha,.001),alpha);
}`;
  function shader(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;}
  let program;
  try{program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));
    gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('Volume shader could not link');
  }catch(e){canvas.remove();return {available:false,clear(){},draw(){}};}
  gl.useProgram(program);const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const loc=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  const res=gl.getUniformLocation(program,'resolution'),clock=gl.getUniformLocation(program,'time');
  let lost=false;canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;canvas.hidden=true;});
  return {get available(){return !lost;},clear(){canvas.hidden=true;},draw(t){
    if(lost)return;canvas.hidden=false;
    const ratio=Math.min(1,880/innerWidth,560/innerHeight),w=Math.round(innerWidth*ratio),h=Math.round(innerHeight*ratio);
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}
    gl.uniform2f(res,w,h);gl.uniform1f(clock,t);gl.drawArrays(gl.TRIANGLES,0,6);
  }};
})();
