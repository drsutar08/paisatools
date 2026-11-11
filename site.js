/* PaisaTools site-wide helpers: dark/light switch, share and print buttons, cookie notice, offline support. */
(function(){
  'use strict';
  var script=document.currentScript;
  var base=script&&script.src?script.src.replace(/site\.js(\?.*)?$/,''):'';
  var root=document.documentElement;
  var store={
    get:function(k){try{return localStorage.getItem(k);}catch(e){return null;}},
    set:function(k,v){try{localStorage.setItem(k,v);}catch(e){}}
  };
  var hi=(document.documentElement.lang||'').indexOf('hi')===0;
  var T=hi?{dark:'डार्क मोड बदलें',copy:'अपने आंकड़ों के साथ लिंक कॉपी करें',copied:'लिंक कॉपी हो गया',print:'प्रिंट / PDF सेव करें',
    note:'हम विज्ञापनों (Google AdSense) और ट्रैफ़िक समझने के लिए कुकीज़ का उपयोग करते हैं।',more:'गोपनीयता नीति',all:'सभी स्वीकारें',ess:'केवल ज़रूरी'}:
    {dark:'Switch between light and dark mode',copy:'Copy link with my numbers',copied:'Link copied',print:'Print or save as PDF',
    note:'We use cookies for ads (Google AdSense) and to understand traffic.',more:'Privacy policy',all:'Accept all',ess:'Essential only'};

  /* ---------- Light / dark switch ---------- */
  function isDark(){
    var t=root.getAttribute('data-theme');
    if(t) return t==='dark';
    return false;
  }
  var header=document.querySelector('header.site');
  if(header){
    var b=document.createElement('button');
    b.type='button';b.className='theme-btn';b.setAttribute('aria-label',T.dark);b.title=T.dark;
    var paint=function(){b.textContent=isDark()?'☀':'☾';b.setAttribute('aria-pressed',isDark());};
    b.addEventListener('click',function(){
      var next=isDark()?'light':'dark';
      root.setAttribute('data-theme',next);store.set('pt-theme',next);paint();
    });
    paint();header.appendChild(b);
  }

  /* ---------- Share and print (calculator pages) ---------- */
  var results=document.querySelector('.tool .results');
  var inputs=document.querySelector('.tool .inputs');
  if(results&&inputs){
    var bar=document.createElement('div');bar.className='share-bar';
    var copy=document.createElement('button');copy.type='button';copy.textContent=T.copy;
    var pr=document.createElement('button');pr.type='button';pr.textContent=T.print;
    var st=document.createElement('span');st.className='share-status';st.setAttribute('role','status');
    bar.appendChild(copy);bar.appendChild(pr);bar.appendChild(st);results.appendChild(bar);

    var collect=function(){
      var p=new URLSearchParams();
      inputs.querySelectorAll('input[id],select[id]').forEach(function(el){if(el.type!=='range')p.set(el.id,el.value);});
      inputs.querySelectorAll('.tabs').forEach(function(g,i){
        var bs=Array.prototype.slice.call(g.querySelectorAll('button'));
        var idx=bs.findIndex(function(x){return x.getAttribute('aria-pressed')==='true';});
        if(idx>=0)p.set('t'+i,idx);
      });
      return p;
    };
    copy.addEventListener('click',function(){
      var url=location.origin+location.pathname+'?'+collect().toString();
      var done=function(){st.textContent=T.copied;setTimeout(function(){st.textContent='';},2500);};
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(url).then(done,function(){window.prompt('Copy this link',url);});}
      else{window.prompt('Copy this link',url);}
    });
    pr.addEventListener('click',function(){window.print();});

    /* Restore numbers from a shared link */
    if(location.search){
      var q=new URLSearchParams(location.search);
      inputs.querySelectorAll('.tabs').forEach(function(g,i){
        var v=q.get('t'+i);if(v===null)return;
        var bs=g.querySelectorAll('button'),btn=bs[+v];
        if(btn&&btn.getAttribute('aria-pressed')!=='true')btn.click();
      });
      q.forEach(function(v,k){
        var el=document.getElementById(k);
        if(!el||el.type==='range'||!inputs.contains(el))return;
        el.value=v;
        el.dispatchEvent(new Event(el.tagName==='SELECT'?'change':'input',{bubbles:true}));
        if(el.tagName!=='SELECT')el.dispatchEvent(new Event('blur'));
      });
    }
  }

  /* ---------- Cookie notice ---------- */
  var consent=store.get('pt-consent');
  if(consent==='essential'){window.adsbygoogle=window.adsbygoogle||[];window.adsbygoogle.requestNonPersonalizedAds=1;}
  if(!consent){
    var box=document.createElement('div');box.className='cookie-note';box.setAttribute('role','dialog');box.setAttribute('aria-label','Cookie notice');
    box.innerHTML='<p>'+T.note+' <a href="'+base+'privacy-policy">'+T.more+'</a></p><div><button type="button" data-c="all">'+T.all+'</button><button type="button" data-c="essential" class="alt">'+T.ess+'</button></div>';
    box.addEventListener('click',function(e){
      var c=e.target.getAttribute&&e.target.getAttribute('data-c');if(!c)return;
      store.set('pt-consent',c);
      if(c==='essential'){window.adsbygoogle=window.adsbygoogle||[];window.adsbygoogle.requestNonPersonalizedAds=1;}
      box.remove();
    });
    document.body.appendChild(box);
  }

  /* ---------- Banner ads (Adsterra) ----------
     <div class="pt-banner" data-slot="top|mid|article|side|bottom"></div> picks a size that fits and loads it when scrolled near. */
  var KEYS={'728x90':'c21b2281a71f55029ba36b623ca772b4','300x250':'a7c44b77be1ac5ba5952e40ca8a94cbf','468x60':'7a856240dfa34dfe9995fc32cfa195fb','160x300':'e3860ad5e234ee3037eb419b667dcb4b'};
  function pickSize(slot,w){
    if(slot==='side')return window.innerWidth>820?'160x300':(w>=300?'300x250':null);
    if(slot==='article')return w>=468?'468x60':(w>=300?'300x250':null);
    if(w>=728)return '728x90';
    if(w>=468)return '468x60';
    return slot==='top'?null:(w>=300?'300x250':null);
  }
  function loadBanner(el){
    var size=pickSize(el.getAttribute('data-slot'),el.clientWidth);
    if(!size){el.hidden=true;return;}
    var p=size.split('x'),k=KEYS[size];
    var f=document.createElement('iframe');
    f.width=p[0];f.height=p[1];f.title='Advertisement';f.setAttribute('scrolling','no');f.setAttribute('frameborder','0');
    f.style.cssText='border:0;display:block;margin:0 auto;max-width:100%';
    f.src=base+'ad-frame.html?s='+size;
    el.appendChild(f);el.setAttribute('data-loaded',size);
    /* Stay collapsed until the ad frame reports it drew something; give up after 10s. */
    var done=false;
    function onMsg(e){if(e.source===f.contentWindow&&e.data&&e.data.ptAdOk){done=true;el.setAttribute('data-ok','');window.removeEventListener('message',onMsg);}}
    window.addEventListener('message',onMsg);
    setTimeout(function(){if(!done){window.removeEventListener('message',onMsg);el.hidden=true;f.remove();}},10000);
  }
  var banners=document.querySelectorAll('.pt-banner');
  if(banners.length){
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);loadBanner(e.target);}});},{rootMargin:'300px'});
      banners.forEach(function(b){io.observe(b);});
    }else banners.forEach(loadBanner);
  }

  /* ---------- Offline support ---------- */
  if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost')){
    window.addEventListener('load',function(){navigator.serviceWorker.register(base+'sw.js').catch(function(){});});
  }
})();
