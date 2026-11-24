  /* ---------- Method: how the study is built, drawn as a radar.
     6 topic slices. Each of the 48 questions is a position on the rim; each wording (A, B, C) is a ring near the rim.
     The light goes round three times: first pass lights one dot per question (count = questions),
     the next two passes add the B and C wordings (count = sessions, 48 x 3 = 144). Replays each time it scrolls into view. */
  var MT=["Agentic media","DAM","Image API","Moderation","Upload UX","Video API"],MANG=[30,90,150,210,-90,-30],MRAD=[124,136,148],MPASS=2.2;
  function methodSvg(){
    var s='<svg viewBox="-12 -12 424 424" role="img" aria-label="48 buyer questions in 6 topics, each asked 3 ways, giving 144 Claude Code sessions">';
    s+='<defs><linearGradient id="grvBeamM" gradientUnits="userSpaceOnUse" x1="'+f1(P(152,-120)[0])+'" y1="'+f1(P(152,-120)[1])+'" x2="'+f1(P(152,-90)[0])+'" y2="'+f1(P(152,-90)[1])+'"><stop offset="0" stop-color="rgba(14,74,47,0)"/><stop offset="1" stop-color="rgba(14,74,47,.22)"/></linearGradient></defs>';
    s+='<circle class="disc" cx="200" cy="200" r="152"/>';
    MANG.forEach(function(a,k){var a0=a-30,a1=a+30,p0=P(152,a0),p1=P(152,a1),q0=P(60,a0),q1=P(60,a1);
      s+='<path class="mslice" data-k="'+k+'" d="M'+f1(q0[0])+' '+f1(q0[1])+'L'+f1(p0[0])+' '+f1(p0[1])+'A152 152 0 0 1 '+f1(p1[0])+' '+f1(p1[1])+'L'+f1(q1[0])+' '+f1(q1[1])+'A60 60 0 0 0 '+f1(q0[0])+' '+f1(q0[1])+'Z"/>';
      var lp=P(84,a);s+='<text class="mnum" data-k="'+k+'" x="'+f1(lp[0])+'" y="'+f1(lp[1]+1)+'">'+(k+1)+'</text><text class="mname" data-k="'+k+'" x="'+f1(lp[0])+'" y="'+f1(lp[1]+16)+'">'+MT[k]+'</text>';});
    MRAD.forEach(function(r){s+='<circle class="mring" cx="200" cy="200" r="'+r+'"/>';});
    var s0=P(152,-120),e0=P(152,-90);
    s+='<g class="msweep"><path d="M200 200L'+f1(s0[0])+' '+f1(s0[1])+'A152 152 0 0 1 '+f1(e0[0])+' '+f1(e0[1])+'Z" fill="url(#grvBeamM)"/><line x1="200" y1="200" x2="'+f1(e0[0])+'" y2="'+f1(e0[1])+'"/></g>';
    MANG.forEach(function(a,k){var a0=a-30;for(var q=0;q<8;q++){var ang=a0+(q+.5)*7.5;
      for(var v=0;v<3;v++){var d=P(MRAD[v],ang);s+='<circle class="mdot" data-v="'+v+'" data-ang="'+f1(ang)+'" cx="'+f1(d[0])+'" cy="'+f1(d[1])+'" r="3.6"/>';}}});
    s+='<circle class="mcore" cx="200" cy="200" r="56"/><text class="mcount" x="200" y="204">0</text><text class="munit" x="200" y="226">questions</text>';
    return s+'</svg>';
  }
  function runMethod(w){
    (w._t||[]).forEach(clearTimeout);w._t=[];var T_=function(f,ms){w._t.push(setTimeout(f,ms));};
    var svgEl=w.querySelector('svg'),cnt=w.querySelector('.mcount'),unit=w.querySelector('.munit'),sw=w.querySelector('.msweep');
    var sl=w.querySelectorAll('.mslice'),nm=w.querySelectorAll('.mnum,.mname'),dt=w.querySelectorAll('.mdot');
    [].forEach.call(w.querySelectorAll('.on'),function(e){e.classList.remove('on')});svgEl.classList.remove('done','sweeping');
    function on(e){e.classList.add('on')}
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){[].forEach.call(sl,on);[].forEach.call(nm,on);[].forEach.call(dt,on);cnt.textContent='144';unit.textContent='sessions · 48 × 3';svgEl.classList.add('done');return;}
    cnt.textContent='0';unit.textContent='questions';
    for(var k=0;k<6;k++)(function(k){T_(function(){on(sl[k]);w.querySelectorAll('[data-k="'+k+'"]').forEach(on);},k*120);})(k);
    var t0=900,n=0;
    T_(function(){sw.style.animation='none';void sw.getBBox();sw.style.animation='grvMSweep '+MPASS+'s linear 3';svgEl.classList.add('sweeping');},t0);
    [].forEach.call(dt,function(d){var v=+d.dataset.v,ang=+d.dataset.ang,ms=t0+(v+(((ang+90)%360)+360)%360/360)*MPASS*1000;
      T_(function(){on(d);n++;if(n<=48){cnt.textContent=String(n);}else{unit.textContent='sessions';cnt.textContent=String(n);}},ms);});
    T_(function(){unit.textContent='sessions · 48 × 3';cnt.textContent='144';svgEl.classList.remove('sweeping');svgEl.classList.add('done');},t0+3*MPASS*1000+200);
  }
  function mountMethod(){
    var host=document.querySelector('#method [class*="max-w-[240px]"]');if(!host||host.querySelector('.grv'))return;
    var w=document.createElement('div');w.className='grv grv-method';w.innerHTML=methodSvg();host.appendChild(w);
    var inView=false;new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&!inView){inView=true;runMethod(w);}else if(!e.isIntersecting){inView=false;}});},{threshold:.35}).observe(w);
    w.querySelector('.mcore').addEventListener('click',function(){runMethod(w);});
  }
