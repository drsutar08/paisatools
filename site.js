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

  /* ---------- Offline support ---------- */
  if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost')){
    window.addEventListener('load',function(){navigator.serviceWorker.register(base+'sw.js').catch(function(){});});
  }
})();
