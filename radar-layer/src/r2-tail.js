  function mountFixes(){
    var fx=document.getElementById('fixes');if(!fx)return;
    var runs=fx.querySelectorAll('[class*="max-w-[200px]"]');
    /* Run 1 and Run 2 drawn exactly like the hero radar (same rings, colours and dot rules), but static.
       Run 2 is the illustration: Brand X closer to the centre and bigger, its Run 1 spot left as a faint ghost. */
    runs.forEach(function(h,k){if(h.querySelector('.grv'))return;var w=document.createElement('div');w.className='grv grv-run2';w.innerHTML=brandSvg();h.appendChild(w);
      var keep=brand;brand='A';drawBrands(w);brand=keep;bind(w);
      w.querySelectorAll('.bd.other').forEach(function(g){var t=g.querySelector('text');if(t)t.remove();});
      if(k===1){var g=w.querySelector('.bd.client'),b=g.querySelector('.b'),t=g.querySelector('text'),x=+b.getAttribute('cx'),y=+b.getAttribute('cy'),r=+b.getAttribute('r'),f=0.12,nx=x*f,ny=y*f;
        var gh=document.createElementNS('http://www.w3.org/2000/svg','circle');gh.setAttribute('class','ghost2');gh.setAttribute('cx',f1(x));gh.setAttribute('cy',f1(y));gh.setAttribute('r',f1(r));g.parentNode.insertBefore(gh,g);
        b.setAttribute('cx',f1(nx));b.setAttribute('cy',f1(ny));b.setAttribute('r',f1(r+14));
        if(t){t.setAttribute('x',f1(nx+(r+14)+16));t.setAttribute('y',f1(ny+11));t.setAttribute('text-anchor','start');}
        g.setAttribute('data-tip','<b>Brand X</b> · illustration<br>Where Brand X could sit on the next run once the fixes ship: named more often and picked first more often');}
    });
    /* the small sector radar beside each fix: the same page-type dots as "What agents read", the fix's own type lit, the light parked on it */
    fx.querySelectorAll('svg').forEach(function(sv){if(!sv.querySelector('.sec')||sv.closest('.sw-radar'))return;
      var NS='http://www.w3.org/2000/svg',g=sv.querySelector('.grv-mini');
      if(!g){g=document.createElementNS(NS,'g');g.setAttribute('class','grv-mini');
        var SC=["#D9573F","#0E4A2F","#4F8A6A","#8CA78F","#8CA78F","#8CA78F","#8CA78F","#B9B0A3","#B9B0A3"],h='';
        for(var k=0;k<9;k++){var e=[100*Math.cos((-90+k*40)*Math.PI/180),100*Math.sin((-90+k*40)*Math.PI/180)];h+='<line class="mdiv" x1="0" y1="0" x2="'+f1(e[0])+'" y2="'+f1(e[1])+'"/>';}
        h+='<g class="mbeam"><path d="M0 0L0 -100A100 100 0 0 1 '+f1(100*Math.cos(-60*Math.PI/180))+' '+f1(100*Math.sin(-60*Math.PI/180))+'Z"/><line x1="0" y1="0" x2="'+f1(100*Math.cos(-60*Math.PI/180))+'" y2="'+f1(100*Math.sin(-60*Math.PI/180))+'"/></g>';
        SRC.forEach(function(r,i){var a=(-70+i*40)*Math.PI/180,r1=8+92*(r[1]/148),sz=4+Math.sqrt(r[2])*0.5,p=[r1*Math.cos(a),r1*Math.sin(a)];
          h+='<g class="mdot" data-i="'+i+'"><circle class="mh" cx="'+f1(p[0])+'" cy="'+f1(p[1])+'" r="'+f1(sz+6)+'" style="stroke:'+SC[i]+'"/><circle class="md" cx="'+f1(p[0])+'" cy="'+f1(p[1])+'" r="'+f1(sz)+'" style="fill:'+SC[i]+'"/></g>';});
        g.innerHTML=h;sv.appendChild(g);}
      var act=-1;sv.querySelectorAll('.sec').forEach(function(sc){if(parseFloat(sc.style.opacity||'1')>0.7)act=+sc.getAttribute('data-i');});
      if(g.dataset.act!==String(act)){g.dataset.act=act;g.querySelectorAll('.mdot').forEach(function(d){d.classList.toggle('on',+d.dataset.i===act);});
        var bm=g.querySelector('.mbeam');bm.style.display=act<0?'none':'';bm.setAttribute('transform','rotate('+(act*40-10)+')');}
    });
  }
  /* ---------- Closing radar: a still mark. Concentric signal rings opening toward the copy, a solid centre. */
  function mountClose(){
    var box=document.querySelector('[class*="md:right-[-11vw]"]>div');if(!box||box.querySelector('.grv-close'))return;
    var w=document.createElement('div');w.className='grv grv-close';
    var s='<svg viewBox="-260 -260 520 520" aria-hidden="true"><defs><linearGradient id="grvCl" x1="-1" y1="-1" x2="1" y2="1" gradientUnits="objectBoundingBox"><stop offset="0" stop-color="#6E9A7E"/><stop offset="1" stop-color="#0E4A2F"/></linearGradient></defs>';
    s+='<circle class="cdisc" r="250"/>';
    /* shaped like a G: every ring runs from the crossbar (3 o'clock) clockwise round to just past 1 o'clock, leaving the G's open mouth;
       the crossbar runs from the centre out to the rim */
    [60,110,160,210].forEach(function(r,i){var a0=0,a1=-48*Math.PI/180,p0=[r,0],p1=[r*Math.cos(a1),r*Math.sin(a1)];
      s+='<path class="carc" d="M'+f1(p0[0])+' '+f1(p0[1])+'A'+r+' '+r+' 0 1 1 '+f1(p1[0])+' '+f1(p1[1])+'" style="stroke-width:14;opacity:'+(1-i*0.18)+'"/>';});
    s+='<line class="cbar" x1="0" y1="0" x2="210" y2="0"/>';
    s+='<circle class="cdot" r="26"/></svg>';
    w.innerHTML=s;box.appendChild(w);
  }
  document.addEventListener('click',function(e){var o=e.target.closest('[class*="_switchOpt"]');if(!o)return;
    var m=/Brand\s+([ABC])/.exec(o.textContent);if(!m)return;brand=m[1];
    hideTip();},true);
  function go(){setInterval(function(){[mountHero,colorQDots,mountSession,syncReads,colorLane,mountSources,mountPlate,mountFixes,mountMethod,mountClose,watchHero,travel].forEach(function(f){try{f()}catch(e){if(!go.err){go.err=1;console.warn('grv',f.name,e&&e.message)}}});},300);}
  if(document.readyState==='complete')setTimeout(go,1200);else addEventListener('load',function(){setTimeout(go,1200);});
})();
