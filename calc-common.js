/* Shared helpers for PaisaTools calculators. */
window.PT=(function(){
  const $=id=>document.getElementById(id);
  const inr=n=>{const r=Math.round(n);return (r<0?'-':'')+'₹'+Math.abs(r).toLocaleString('en-IN');};
  const short=n=>{const a=Math.abs(n),s=n<0?'-':'';return s+(a>=1e7?'₹'+(a/1e7).toFixed(2).replace(/\.?0+$/,'')+' Cr':a>=1e5?'₹'+(a/1e5).toFixed(1).replace(/\.0$/,'')+' L':a>=1e3?'₹'+Math.round(a/1e3)+'K':'₹'+Math.round(a));};
  const num=v=>parseFloat(String(v).replace(/[^0-9.]/g,''));
  const fInt=v=>Math.round(v).toLocaleString('en-IN');
  const fDec=v=>String(+(+v).toFixed(2));
  /* list: [{id,val,fmt}] — a text box #id paired with a slider #idR */
  function bind(list,cb){
    list.forEach(o=>{
      const box=$(o.id),range=$(o.id+'R'),fmt=o.fmt||fInt;
      box.value=fmt(o.val); if(range) range.value=o.val;
      box.addEventListener('input',()=>{const v=num(box.value); if(range&&!isNaN(v)) range.value=v; cb();});
      box.addEventListener('blur',()=>{const v=num(box.value); if(!isNaN(v)) box.value=fmt(v);});
      if(range) range.addEventListener('input',()=>{box.value=fmt(+range.value); cb();});
    });
  }
  function tabs(sel,cb){
    const bs=document.querySelectorAll(sel+' button');
    bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed',x===b)); cb(b.dataset.v);}));
  }
  function parse(t){const m=String(t).replace(/,/g,'').match(/([0-9.]+)s*(Cr|L|K)?/);if(!m)return 0;let v=parseFloat(m[1]);if(m[2]==='Cr')v*=1e7;else if(m[2]==='L')v*=1e5;else if(m[2]==='K')v*=1e3;return v;}
  /* Keep the donut in step with result boxes: fn gets the numbers shown in ids and returns the share (0 to 1) of the second colour. */
  function donut(ids,fn){
    const arc=$('arc'),pct=$('pct');if(!arc||!pct)return;
    const run=()=>{const s=fn(ids.map(i=>parse($(i).textContent)));if(!isFinite(s))return;const C=2*Math.PI*52;arc.setAttribute('stroke-dasharray',((1-s)*C).toFixed(2)+' '+C.toFixed(2));pct.textContent=Math.round(s*100)+'%';};
    if(typeof MutationObserver!=='undefined'){const mo=new MutationObserver(run);ids.forEach(i=>mo.observe($(i),{childList:true,characterData:true,subtree:true}));}
    run();
  }
  return {$,inr,short,num,fInt,fDec,bind,tabs,donut};
})();
