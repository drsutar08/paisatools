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
  return {$,inr,short,num,fInt,fDec,bind,tabs};
})();
