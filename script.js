
let slides=[], current=0;
fetch("content.json").then(r=>r.json()).then(data=>{
  slides=data.homeSlides;
  const hero=document.querySelector(".hero");
  slides.forEach((s,i)=>{
    const el=document.createElement("section");
    el.className="slide";
    el.innerHTML=`<div><h1>${s.title}</h1><p>${s.subtitle}</p></div>`;
    el.style.display=i===0?"flex":"none";
    hero.insertBefore(el, hero.querySelector(".arrow"));
  });
});
function move(dir){
  const els=document.querySelectorAll(".slide");
  if(!els.length)return;
  els[current].style.display="none";
  current=(current+dir+els.length)%els.length;
  els[current].style.display="flex";
}
setInterval(()=>move(1),6000);
