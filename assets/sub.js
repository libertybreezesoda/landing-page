/* Shared helpers for the secondary pages. */
// Same-origin when served next to ERPNext (nginx proxies /api/method/lbs_web.*); otherwise hit the ERP host directly.
const API = /(^|\.)libertybreezesoda\.com$/i.test(location.hostname) && !/^app\./i.test(location.hostname)
  ? "" : "https://app.libertybreezesoda.com";

async function erp(method){
  const r = await fetch(`${API}/api/method/lbs_web.api.${method}`, {headers:{Accept:"application/json"}});
  if(!r.ok) throw new Error(`ERP ${r.status}`);
  return (await r.json()).message;
}
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

function setLive(ok, when){
  const el=document.getElementById("live"); if(!el) return;
  el.classList.toggle("off", !ok);
  el.querySelector("span").textContent = ok
    ? `Live from our inventory system · updated ${new Date(when).toLocaleString([], {dateStyle:"medium", timeStyle:"short"})}`
    : "Live data unavailable right now";
}

// nav + mobile menu + stars + reveals
(()=>{
  const btn=document.getElementById("menu-btn"),panel=document.getElementById("mobile-menu"),x=document.getElementById("mm-close");
  if(btn&&panel){
    const set=o=>{panel.classList.toggle("open",o);btn.setAttribute("aria-expanded",o)};
    btn.addEventListener("click",()=>set(!panel.classList.contains("open")));
    x.addEventListener("click",()=>set(false));
  }
  const sky=document.getElementById("stars");
  if(sky&&!matchMedia("(prefers-reduced-motion: reduce)").matches){
    for(let i=0;i<90;i++){const s=document.createElement("span");s.className="star";const z=Math.random()*2.2+.6;
      s.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*100}%;width:${z}px;height:${z}px;animation-duration:${1.5+Math.random()*3}s;animation-delay:${-Math.random()*4}s`;sky.appendChild(s)}
  }
  document.querySelectorAll(".nav-links a,.mobile-menu a").forEach(a=>{if(a.getAttribute("href")===location.pathname)a.classList.add("here")});
})();
function revealAll(){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("on");io.unobserve(e.target)}}),{threshold:.1});
  document.querySelectorAll(".reveal:not(.on)").forEach(el=>io.observe(el));
}
