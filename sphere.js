const projects=[
  ["Falkor Gateway","#falkor"],["Sirius Player","#sirius"],["Quasar Audio","#audio"],
  ["Bitron Console","#bitron"],["Nexora HMI","#nexora"],["LCD Clock","#clock"],
  ["Walkman Digital","#walkman"],["Corrigo Control","#corrigo"],["Industrial I/O","#industrial"],
  ["ESP32 Systems","#esp32"],["STM32 Multicore","#stm32"],["Modbus / MQTT","#modbus"],
  ["Audio DSP","#dsp"],["PCB Design","#pcb"],["Automation","#automation"],
  ["IoT & Wireless","#iot"],["Custom Hardware","#hardware"],["Research Lab","#research"],
  ["MIDI Synth","#midi"],["Embedded UI","#ui"],["View All Projects","#all"]
];
const sphere=document.getElementById("sphere"),wrap=sphere.parentElement;
const points=projects.map((project,i)=>{
  const phi=Math.acos(1-2*(i+.5)/projects.length),theta=Math.PI*(1+Math.sqrt(5))*i;
  const el=document.createElement("a");el.className="sphere-link";el.href=project[1];el.textContent=project[0];
  sphere.appendChild(el);return{el,x:Math.sin(phi)*Math.cos(theta),y:Math.cos(phi),z:Math.sin(phi)*Math.sin(theta)};
});
let rx=-.18,ry=.55,vx=.0012,vy=.0025,drag=false,lastX=0,lastY=0,moved=0,raf,launching=false,pressedPoint=null;
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
function render(){
  const radius=wrap.clientWidth*.405,cx=Math.cos(rx),sx=Math.sin(rx),cy=Math.cos(ry),sy=Math.sin(ry);
  points.forEach(p=>{const x1=p.x*cy-p.z*sy,z1=p.x*sy+p.z*cy,y1=p.y;const y2=y1*cx-z1*sx,z2=y1*sx+z1*cx;const depth=(z2+1)/2,scale=.62+depth*.72,curve=.48+depth*.52,tilt=-x1*13;p.el.style.transform=`translate(-50%,-50%) translate(${x1*radius}px,${y2*radius}px) rotate(${tilt}deg) scale(${scale}) scaleX(${curve})`;p.el.style.opacity=.18+depth*.82;p.el.style.zIndex=Math.floor(depth*100);p.el.style.pointerEvents=depth<.28?"none":"auto"});
}
function animate(){if(!drag&&!launching&&!reduce){ry+=vy;rx+=vx;vy*=.996;vx*=.996;if(Math.abs(vy)<.0008)vy=.0008}render();raf=requestAnimationFrame(animate)}
function start(x,y){drag=true;moved=0;lastX=x;lastY=y;vx=vy=0}
function move(x,y){if(!drag)return;const dx=x-lastX,dy=y-lastY;moved+=Math.abs(dx)+Math.abs(dy);ry-=dx*.006;rx+=dy*.006;vy=-dx*.00045;vx=dy*.00045;lastX=x;lastY=y}
function end(){drag=false}
function shortest(from,to){return from+Math.atan2(Math.sin(to-from),Math.cos(to-from))}
function launchProject(point){
  if(launching)return;
  launching=true;drag=false;vx=vy=0;
  const href=point.el.getAttribute("href"),startX=rx,startY=ry;
  const targetY=shortest(startY,Math.atan2(point.x,point.z));
  const horizontal=Math.hypot(point.x,point.z);
  const targetX=shortest(startX,Math.atan2(point.y,horizontal));
  const veil=document.createElement("div");veil.className="sphere-flight-veil";document.body.appendChild(veil);
  point.el.classList.add("selected-project");
  document.body.classList.add("sphere-is-aiming");
  const duration=reduce?180:820,startTime=performance.now();
  function aim(now){
    const t=Math.min(1,(now-startTime)/duration),ease=1-Math.pow(1-t,4);
    rx=startX+(targetX-startX)*ease;ry=startY+(targetY-startY)*ease;
    if(t<1){requestAnimationFrame(aim);return}
    document.body.classList.add("sphere-is-flying");
    setTimeout(()=>veil.classList.add("show"),20);
    setTimeout(()=>{if(href&&href!=="#")location.href=href},reduce?260:4350);
    setTimeout(()=>{
      document.body.classList.remove("sphere-is-aiming","sphere-is-flying");
      point.el.classList.remove("selected-project");veil.remove();launching=false;
    },reduce?520:4800);
  }
  requestAnimationFrame(aim);
}
wrap.addEventListener("pointerdown",e=>{
  const link=e.target.closest(".sphere-link");
  pressedPoint=link?points.find(p=>p.el===link):null;
  wrap.setPointerCapture(e.pointerId);
  start(e.clientX,e.clientY);
});
wrap.addEventListener("pointermove",e=>move(e.clientX,e.clientY));
wrap.addEventListener("pointerup",e=>{
  const point=pressedPoint,activate=moved<=12;
  pressedPoint=null;end();
  if(point&&activate&&!launching){e.preventDefault();launchProject(point)}
});
wrap.addEventListener("pointercancel",()=>{pressedPoint=null;end()});
wrap.addEventListener("click",e=>{const link=e.target.closest(".sphere-link");if(!link)return;e.preventDefault();if(e.detail===0&&!launching){const point=points.find(p=>p.el===link);if(point)launchProject(point)}});
window.addEventListener("resize",render);render();animate();
