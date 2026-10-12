  function posOf(x,b){return x[3+"ABC".indexOf(b)];}
  var BAND={1:[18,110],2:[140,235],3:[265,360],4:[390,485],0:[525,580]};
  function place(x,b){var pos=posOf(x,b),band=BAND[pos>=4?4:pos],ang=-90+x[0]*60-30+(x[1]+.5)*7.5+(x[2]-1)*2.2,r=band[0]+x[8]*(band[1]-band[0]);return{p:Q(r,ang),ang:ang,pos:pos};}
  function result(x,b){var pos=posOf(x,b);return x[6]===b?'picked '+WHO[b]+' first':WHO[b]+(pos===0?' not seen':' named '+ord(pos));}
  function colorOf(x){return x[6]===brand?FOCUS:COL[x[6]];}
  function tipFor(x){return '<b>'+(x[6]===brand?'Picked '+WHO[brand]+' first':'Picked '+WHO[x[6]]+' · '+result(x,brand))+'</b><br>“'+esc(x[9])+(x[9].length>=140?'…':'')+'”<br><span style=&quot;opacity:.75&quot;>'+TOP[x[0]]+' · phrasing '+'ABC'[x[2]]+' · '+(x[7]?'Codex CLI':'Claude Code')+'</span>';}
  function hitAt(a){return f1(((((a+60)%360)+360)%360)/360*T);}
  function sessSvg(){
    var s='<svg viewBox="-500 -500 1000 1000" overflow="visible" aria-hidden="false" role="img" aria-label="Sessions by where the brand landed">';
    s+='<circle class="disc" r="500"/><circle class="ring" r="125"/><circle class="ring" r="250"/><circle class="ring" r="375"/><circle class="ring rim" r="500"/><circle class="ring dash" r="560"/>';
    for(var k=0;k<6;k++){var a=Q(500,-120+k*60);s+='<line class="axis" x1="0" y1="0" x2="'+f1(a[0])+'" y2="'+f1(a[1])+'"/>';}
    var s0=Q(500,-90),e0=Q(500,-60);
    s+='<g class="sweep" style="animation-duration:'+T+'s"><path d="M0 0L'+f1(s0[0])+' '+f1(s0[1])+'A500 500 0 0 1 '+f1(e0[0])+' '+f1(e0[1])+'Z" fill="url(#grvBeam)"/><line class="beam" x1="0" y1="0" x2="'+f1(e0[0])+'" y2="'+f1(e0[1])+'"/></g>';
    s+='<defs><linearGradient id="grvBeam" gradientUnits="userSpaceOnUse" x1="'+f1(s0[0])+'" y1="'+f1(s0[1])+'" x2="'+f1(e0[0])+'" y2="'+f1(e0[1])+'"><stop offset="0" stop-color="rgba(14,74,47,0)"/><stop offset="1" stop-color="rgba(14,74,47,.22)"/></linearGradient></defs>';
    return s+'<g class="dots"></g></svg>';
  }
  /* draw sessions: keys = list of SESS indexes; cur = indexes of the question on screen */
  function drawDots(w,keys,cur){
    var g=w.querySelector('.dots'),s='';
    keys.forEach(function(n){var x=SESS[n],pl=place(x,brand),on=cur&&cur.indexOf(n)>=0,r=on?15:7,d=hitAt(pl.ang);
      s+='<g class="sd pk-'+x[6]+(on?' cur':'')+'" tabindex="0" role="button" data-tip="'+tipFor(x).replace(/"/g,'&quot;')+'" aria-label="'+esc(TOP[x[0]]+', phrasing '+'ABC'[x[2]]+': '+result(x,brand))+'">'+
        (on?'<circle class="ping" cx="'+f1(pl.p[0])+'" cy="'+f1(pl.p[1])+'" r="'+(r+4)+'" style="stroke:'+colorOf(x)+';animation-duration:'+T+'s;animation-delay:'+d+'s"/>':'')+
        '<circle class="b" cx="'+f1(pl.p[0])+'" cy="'+f1(pl.p[1])+'" r="'+r+'" style="fill:'+colorOf(x)+'"/>'+
        (on?'<text x="'+f1(pl.p[0]+r+8)+'" y="'+f1(pl.p[1]+9)+'">'+'ABC'[x[2]]+'</text>':'')+'</g>';});
    g.innerHTML=s;
  }
  function showTip(el){if(!tip){tip=document.createElement('div');tip.className='grv-tip';tip.setAttribute('role','status');document.body.appendChild(tip);}
    tip.innerHTML=el.getAttribute('data-tip');tip.classList.add('on');var tg=el.matches('path,circle')?el:(el.querySelector('.b,path,circle')||el),r=tg.getBoundingClientRect(),w=tip.offsetWidth,h=tip.offsetHeight;
    var x=Math.max(8,Math.min(innerWidth-w-8,r.left+r.width/2-w/2)),y=r.top-h-10;if(y<8)y=r.bottom+10;tip.style.left=x+'px';tip.style.top=y+'px';}
  function hideTip(){tip&&tip.classList.remove('on');}
  function bind(w){
    w.addEventListener('mouseover',function(e){var b=e.target.closest('[data-tip]');b?showTip(b):hideTip();});
    w.addEventListener('mouseleave',hideTip);
    w.addEventListener('focusin',function(e){var b=e.target.closest('[data-tip]');b&&showTip(b);});
    w.addEventListener('focusout',hideTip);
  }
  addEventListener('scroll',hideTip,{passive:true});

  /* ---------- Hero: the GEO Radar visibility radar. One dot per brand.
     Distance from centre = 100 - share of sessions that named the brand; dot size = share picked first.
     The client (the brand in "View as") is the one dark green dot; the strongest competitor is red. */
  var OVER={A:[49,107],B:[19,31],C:[11,40]}; /* picked first, named, of 148 sessions */
  function brandSvg(){
    var s='<svg viewBox="-500 -500 1000 1000" overflow="visible" role="img" aria-label="Visibility radar: one dot per brand. Closer to the centre = named more often. Bigger dot = picked first more often.">';
    s+='<circle class="disc" r="500"/><circle class="ring" r="125"/><circle class="ring" r="250"/><circle class="ring" r="375"/><circle class="ring rim" r="500"/>';
    s+='<line class="axis" x1="-500" y1="0" x2="500" y2="0"/><line class="axis" x1="0" y1="-500" x2="0" y2="500"/>';
    [[125,"75%"],[250,"50%"],[375,"25%"],[500,"0% named"]].forEach(function(l){s+='<text class="rl" x="10" y="'+(l[0]-10)+'">'+l[1]+'</text>';});
    var s0=Q(500,-90),e0=Q(500,-60);
    s+='<defs><linearGradient id="grvBeamH" gradientUnits="userSpaceOnUse" x1="'+f1(s0[0])+'" y1="'+f1(s0[1])+'" x2="'+f1(e0[0])+'" y2="'+f1(e0[1])+'"><stop offset="0" stop-color="rgba(14,74,47,0)"/><stop offset="1" stop-color="rgba(14,74,47,.22)"/></linearGradient></defs>';
    s+='<g class="sweep" style="animation-duration:'+T+'s"><path d="M0 0L'+f1(s0[0])+' '+f1(s0[1])+'A500 500 0 0 1 '+f1(e0[0])+' '+f1(e0[1])+'Z" fill="url(#grvBeamH)"/><line class="beam" x1="0" y1="0" x2="'+f1(e0[0])+'" y2="'+f1(e0[1])+'"/></g>';
    return s+'<g class="dots"></g></svg>';
  }
  /* Hero radar, from the sample study itself (same numbers as the line under it).
     Your brand = the brand in "View as". Its two rivals are the other named brands; the biggest is red.
     "Other vendors" = every other vendor combined, plotted by the sessions where one of them was picked first. */
  function drawBrands(w){
    var rivals=BR.filter(function(b){return b!==brand}).sort(function(a,b){return OVER[b][0]-OVER[a][0]});
    var list=[[brand,"Brand "+brand,OVER[brand][1],OVER[brand][0],200,FOCUS,"the brand in view"],
      [rivals[0],"Brand "+rivals[0],OVER[rivals[0]][1],OVER[rivals[0]][0],-25,"#D9573F","biggest competitor"],
      [rivals[1],"Brand "+rivals[1],OVER[rivals[1]][1],OVER[rivals[1]][0],125,"#E3A33A","competitor"],
    ];
    /* the vendors outside Brands A to C, one dot per topic (the study does not name them) */
    var OTH=[["Upload UX",16,24,-75],["Video API",5,24,-5],["Agentic media",5,28,40],["DAM",21,24,100],["Image API",10,24,160],["Moderation",12,24,235]];
    OTH.forEach(function(o){list.push(["O","Other vendor · "+o[0],o[1],o[1],o[3],"#B9B0A3","picked first in "+o[1]+" of "+o[2]+" "+o[0]+" sessions",o[2]]);});
    var s='';list.forEach(function(e){var named=100*e[2]/148,first=100*e[3]/148,dist=Math.max(40,(1-named/100)*500),p=Q(dist,e[4]),r=12+first*0.9,d=hitAt(e[4]),c=Math.cos(e[4]*Math.PI/180);
      var tipH='<b>'+e[1]+'</b>'+(e[0]==='O'?'':' · '+e[6])+'<br>'+(e[0]==='O'?'Another vendor was picked first in <b>'+e[2]+'</b> of '+e[7]+' sessions on this topic<br><span style=&quot;opacity:.75&quot;>The study does not name it or count its mentions, so it is placed by those picks ('+(Math.round(e[2]/1.48*10)/10)+'% of all 148)</span>':'Named in <b>'+e[2]+'</b> of 148 sessions ('+(Math.round(named*10)/10)+'%)<br>Picked first in <b>'+e[3]+'</b> ('+(Math.round(first*10)/10)+'%)');
      s+='<g class="bd'+(e[0]===brand?' client':'')+(e[0]==='O'?' other':'')+'" data-k="'+(e[0]==='O'?'O'+e[1].replace('Other vendor · ',''):e[0])+'" data-l="'+(e[0]==='O'?'Other vendors':e[1])+'" tabindex="0" role="button" data-tip="'+tipH.replace(/"/g,'&quot;')+'" aria-label="'+e[1]+', '+e[6]+'">'+
        (e[0]==='O'?'':'<circle class="ping" cx="'+f1(p[0])+'" cy="'+f1(p[1])+'" r="'+f1(r+6)+'" style="stroke:'+e[5]+';animation-duration:'+T+'s;animation-delay:'+d+'s"/>')+
        '<circle class="b" cx="'+f1(p[0])+'" cy="'+f1(p[1])+'" r="'+f1(e[0]==='O'?8+e[2]*0.9:r)+'" style="fill:'+e[5]+'"/>'+
        ((e[0]==='O'&&e[1].indexOf('DAM')<0)?'':'<text'+(e[0]==='O'?' class="olbl"':'')+' x="'+f1(p[0]>0?p[0]-(e[0]==='O'?8+e[2]*0.9:r)-16:p[0]+r+16)+'" y="'+f1(p[1]+11)+'" text-anchor="'+(p[0]>0?'end':'start')+'">'+(e[0]==='O'?'Other vendors':e[1])+'</text>')+'</g>';});
    w.querySelector('.dots').innerHTML=s;
  }
  function mountHero(){
    var frame=document.querySelector('[class*="_poster"] [class*="_frame"]');if(!frame)return;
    var w=frame.querySelector('.grv-hero');
    if(!w){w=document.createElement('div');w.className='grv grv-hero';w.innerHTML=brandSvg()+'<div class="grv-key">Closer to the centre = named more often.<br>Bigger dot = picked first more often.</div>';frame.appendChild(w);bind(w);frame.style.pointerEvents='auto';w.dataset.b='';}
    if(w.dataset.b!==brand){w.dataset.b=brand;drawBrands(w);}
  }
  /* ---------- One session, slowed down: every session faint, same geometry as the page's own rings. */
  /* ---------- One session, slowed down: the same brand radar, then it follows the steps on the right.
     Intro / 01 Ask / 02 Watch: the whole-study radar, with this one session marked.
     03 Score: the radar switches to this session's result: rings become places in the answer
     (picked first, named 2nd, 3rd, 4th+, not seen) and each brand moves to where it landed.
     04 Fix: an arrow shows the move the fix list is aiming for. */
  var SESSION_ID='agentic-media-04-a',SANG=27;
  var RANKR={1:55,2:157,3:312,4:440,0:545};
  function sessionRow(){for(var i=0;i<SESS.length;i++)if(SESS[i][10]===SESSION_ID)return SESS[i];return null;}
  /* Step content drawn on the radar: the 3 wordings (01 Ask) and the pages read (02 Watch). */
  var READS=[["Open-source tool homepage","diy",1],["npm package page","your-listing",0],["Brand A docs: SDK","yours",1],["Rival repo on GitHub","publish-here",1],["Brand A docs: transformations","yours",1],["Comparison article (pistack.xyz)","request-mention",1]];
  var TAGANG={"rival":-70,"yours":-30,"your-listing":10,"request-mention":50,"publish-here":90,"standard":130,"diy":170,"unclassified":210,"news":250};
  var TAGCOL={"yours":"#0E4A2F","your-listing":"#E3A33A","rival":"#D9573F","diy":"#8CA78F","publish-here":"#8CA78F","request-mention":"#8CA78F","standard":"#8CA78F","unclassified":"#B9B0A3","news":"#B9B0A3"};
  var TAGTXT={"yours":"own page","your-listing":"listing","rival":"rival page","diy":"DIY guide","publish-here":"accepts submissions","request-mention":"could mention you","standard":"neutral reference","unclassified":"unclassified","news":"news"};
  function readsSvg(){
    /* drawn like the plumes beside it: a dark core with a soft green glow; glow size = how many sessions read that type of page */
    var SESSN={"diy":10,"your-listing":58,"yours":97,"publish-here":22,"request-mention":31,"standard":15,"rival":125,"unclassified":1,"news":1};
    var pts=READS.map(function(r,i){return Q(360,-150+i*50);}),start=Q(157,SANG),all=[start].concat(pts);
    /* smooth curve through the points, like the trail beside it */
    var d='M'+f1(all[0][0])+' '+f1(all[0][1]);
    for(var k=0;k<all.length-1;k++){var p0=all[k>0?k-1:k],p1=all[k],p2=all[k+1],p3=all[k+2<all.length?k+2:k+1];
      var c1=[p1[0]+(p2[0]-p0[0])/6,p1[1]+(p2[1]-p0[1])/6],c2=[p2[0]-(p3[0]-p1[0])/6,p2[1]-(p3[1]-p1[1])/6];
      d+=' C'+f1(c1[0])+' '+f1(c1[1])+' '+f1(c2[0])+' '+f1(c2[1])+' '+f1(p2[0])+' '+f1(p2[1]);}
    var s='<defs>'+Object.keys(TAGCOL).map(function(k){return '<radialGradient id="grvPl-'+k+'"><stop offset="0" stop-color="'+TAGCOL[k]+'" stop-opacity=".9"/><stop offset=".5" stop-color="'+TAGCOL[k]+'" stop-opacity=".32"/><stop offset="1" stop-color="'+TAGCOL[k]+'" stop-opacity="0"/></radialGradient>'}).join('')+'</defs><path class="rtrail" d="'+d+'"/>';
    READS.forEach(function(r,i){var p=pts[i],ang=Math.atan2(p[1],p[0]),c=Math.cos(ang),sn=Math.sin(ang),gr=24+Math.sqrt(SESSN[r[1]])*7;
      var lx=p[0]+(c>=0?1:-1)*(gr*0.55+10),ly=p[1]+(sn>0.3?gr*0.55+18:sn<-0.3?-(gr*0.55+28):-6),an=Math.abs(c)<0.35?'middle':(c>=0?'start':'end');
      if(Math.abs(c)<0.35)lx=p[0];
      s+='<g class="rd" data-i="'+i+'" data-tip="'+('<b>0'+(i+1)+' '+esc(r[0])+'</b><br>'+TAGTXT[r[1]]+(r[2]?' · cited':'')+'<br><span style=&quot;opacity:.75&quot;>Glow size: '+SESSN[r[1]]+' of 148 sessions read this type of page</span>').replace(/"/g,'&quot;')+'" tabindex="0" role="button">'+
        '<circle class="rglow" cx="'+f1(p[0])+'" cy="'+f1(p[1])+'" r="'+f1(gr)+'" fill="url(#grvPl-'+r[1]+')"/><circle class="rcore" cx="'+f1(p[0])+'" cy="'+f1(p[1])+'" r="8" style="fill:'+TAGCOL[r[1]]+'"/>'+
        '<text class="rlab" x="'+f1(lx)+'" y="'+f1(ly)+'" text-anchor="'+an+'"><tspan class="rnum">0'+(i+1)+'</tspan> '+esc(r[0])+'<tspan class="rtype" x="'+f1(lx)+'" dy="22">'+TAGTXT[r[1]].toUpperCase()+(r[2]?' / CITED':'')+'</tspan></text></g>';});
    return s;
  }
  function phrSvg(){
    var t=2,q=3,s='';
    SESS.forEach(function(x){if(x[0]!==t||x[1]!==q||x[7])return;var pos=posOf(x,brand),r=RANKR[pos>=4?4:pos],ang=[SANG,-35,-120][x[2]],p=x[2]===0&&pos===2?Q(157,SANG):Q(pos===1?70:r,ang),col=x[6]===brand?FOCUS:(x[6]==='O'?'#B9B0A3':'#D9573F');
      var res=x[6]===brand?'picked '+BN(brand)+' first':BN(brand)+(pos===0?' not seen':' named '+ord(pos));
      s+='<g class="ph'+(x[2]===0?' cur':'')+'" data-tip="'+('<b>Wording '+'ABC'[x[2]]+'</b> · '+res+'<br>“'+esc(x[9])+'”').replace(/"/g,'&quot;')+'" tabindex="0" role="button">'+
        '<circle class="b" cx="'+f1(p[0])+'" cy="'+f1(p[1])+'" r="26" style="fill:'+col+'"/><text class="pl" x="'+f1(p[0])+'" y="'+f1(p[1]+8)+'">'+'ABC'[x[2]]+'</text>'+
        '<text class="pr" x="'+f1(x[2]===2?p[0]-40:p[0]+40)+'" y="'+f1(p[1]+(x[2]===0?48:9))+'" text-anchor="'+(x[2]===2?'end':'start')+'">'+res+'</text></g>';});
    return s;
  }
  /* keep the pages on the radar in step with the pages revealed on the right (01 to 06) */
  /* the plumes on the right take the radar's colours, so both show the same dots */
  function colorLane(){
    var svg=document.querySelector('.lane-trail svg');if(!svg||svg.dataset.grv)return;svg.dataset.grv=1;
    var defs=document.createElementNS('http://www.w3.org/2000/svg','defs');
    defs.innerHTML=Object.keys(TAGCOL).map(function(k){return '<radialGradient id="grvLn-'+k+'"><stop offset="0" stop-color="'+TAGCOL[k]+'" stop-opacity=".9"/><stop offset=".5" stop-color="'+TAGCOL[k]+'" stop-opacity=".32"/><stop offset="1" stop-color="'+TAGCOL[k]+'" stop-opacity="0"/></radialGradient>'}).join('');
    svg.appendChild(defs);
    var pl=svg.querySelectorAll('.lane-plume'),co=svg.querySelectorAll('.lane-core');
    READS.forEach(function(r,i){if(pl[i])pl[i].style.fill='url(#grvLn-'+r[1]+')';if(co[i])co[i].style.fill=TAGCOL[r[1]];});
  }
  function syncReads(){
    var w=document.querySelector('.grv-ss');if(!w)return;var labels=document.querySelectorAll('.lane-label'),shown=0;
    w.querySelectorAll('.rd').forEach(function(g){var l=labels[+g.dataset.i],o=l?parseFloat(getComputedStyle(l).opacity)||0:0;g.style.opacity=String(o);if(o>0.05)shown=Math.max(shown,+g.dataset.i+1-(1-o));});
    var tr=w.querySelector('.rtrail');if(tr){var L=tr.getTotalLength();tr.style.strokeDasharray=L;tr.style.strokeDashoffset=String(L*(1-Math.min(1,shown/6)));}
  }
  addEventListener('scroll',function(){requestAnimationFrame(syncReads)},{passive:true});
  function mountSession(){
    var host=document.querySelector('.ss-radar');if(!host)return;
    var w=host.querySelector('.grv-ss');
    if(!w){w=document.createElement('div');w.className='grv grv-ss';
      var svg=brandSvg().replace('</svg>','<g class="ranks">'+[[55,"Picked first"],[190,"Named 2nd"],[312,"Named 3rd"],[440,"Named 4th+"],[545,"Not seen"]].map(function(l){return '<text class="rk" x="-12" y="'+(l[0]+8)+'" text-anchor="end">'+l[1]+'</text>'}).join('')+'</g><g class="fixarrow"><circle class="fxring" r="0"/><circle class="fxghost" r="0"/><text class="fixt" x="0" y="0"></text><text class="fxgoal" x="0" y="0"></text></g><g class="reads">'+readsSvg()+'</g><g class="phr"></g><g class="sdot"><circle class="sping" cx="'+f1(Q(157,SANG)[0])+'" cy="'+f1(Q(157,SANG)[1])+'" r="30" style="animation-duration:'+T+'s;animation-delay:'+hitAt(SANG)+'s"/><circle class="score" cx="'+f1(Q(157,SANG)[0])+'" cy="'+f1(Q(157,SANG)[1])+'" r="22"/></g><g class="thiss"><text x="'+f1(Q(157,SANG)[0]+28)+'" y="'+f1(Q(157,SANG)[1]+52)+'">This session: Q4 · wording A</text></g></svg>');
      w.innerHTML=svg;var rg=host.querySelector('.ss-rings');host.insertBefore(w,rg||null);bind(w);w.dataset.b='';}
    if(w.dataset.b!==brand){w.dataset.b=brand;drawBrands(w);w.querySelector('.phr').innerHTML=phrSvg();w.dataset.step='';}
    var step='intro';document.querySelectorAll('.lane-step').forEach(function(s){var h=s.querySelector('.lane-head');if(h&&parseFloat(getComputedStyle(h).opacity)>0.5)step=s.dataset.step;});
    if(w.dataset.step===step)return;w.dataset.step=step;w.className='grv grv-ss st-'+step;
    var row=sessionRow(),scored=step==='score'||step==='fix';
    var rivals=BR.filter(function(b){return b!==brand}).sort(function(a,b){return OVER[b][0]-OVER[a][0]});
    var off={};off[brand]=0;off[rivals[0]]=-22;off[rivals[1]]=22;
    w.querySelectorAll('.bd').forEach(function(g){
      var k=g.getAttribute('data-k'),b=g.querySelector('.b'),cx0=+b.getAttribute('cx'),cy0=+b.getAttribute('cy'),tx=0,ty=0,lbl=g.getAttribute('data-l');
      var t=g.querySelector('text');
      if(scored&&row){
        if(BR.indexOf(k)>=0){var pos=row[3+"ABC".indexOf(k)],r=RANKR[pos>=4?4:pos],p=Q(r,pos===0?(off[k]<0?128:152):SANG+off[k]);tx=p[0]-cx0;ty=p[1]-cy0;
          if(t){var br=+b.getAttribute('r');if(pos===0){t.setAttribute('x',f1(cx0));t.setAttribute('y',f1(cy0+br+36));t.setAttribute('text-anchor','middle');}else{t.setAttribute('x',f1(cx0-br));t.setAttribute('y',f1(cy0+br+38));t.setAttribute('text-anchor','start');}}
          if(t)t.textContent=BN(k)+' · '+(row[6]===k?'picked first':pos===0?'not seen':'named '+ord(pos));}
        else if(k==='OAgentic media'&&row[6]==='O'){tx=-cx0;ty=-cy0;if(!t){t=document.createElementNS('http://www.w3.org/2000/svg','text');t.setAttribute('class','olbl');g.appendChild(t);}t.setAttribute('x',f1(cx0+24));t.setAttribute('y',f1(cy0-26));t.setAttribute('text-anchor','start');t.textContent='Another vendor · picked first';}
      } else if(t&&lbl){t.textContent=(k.charAt(0)==='O'&&k!=='ODAM')?'':lbl;var br0=+b.getAttribute('r');t.setAttribute('y',f1(cy0+11));t.setAttribute('x',f1(cx0>0?cx0-br0-16:cx0+br0+16));t.setAttribute('text-anchor',cx0>0?'end':'start');}
      g.style.transform='translate('+f1(tx)+'px,'+f1(ty)+'px)';
    });
    var fa=w.querySelector('.fixarrow');
    if(step==='fix'&&row){var pos=row[3+"ABC".indexOf(brand)],r=RANKR[pos>=4?4:pos],p=Q(r,SANG),q2=Q(70,SANG);
      var bb=w.querySelector('.bd[data-k="'+brand+'"] .b'),br=bb?+bb.getAttribute('r'):22,q2=Q(RANKR[1],SANG+12);
      var rg=fa.querySelector('.fxring'),gh=fa.querySelector('.fxghost');
      rg.setAttribute('cx',f1(q2[0]));rg.setAttribute('cy',f1(q2[1]));rg.setAttribute('r',f1(br));
      gh.setAttribute('cx',f1(p[0]));gh.setAttribute('cy',f1(p[1]));gh.setAttribute('r',f1(br));gh.style.setProperty('--dx',f1(q2[0]-p[0])+'px');gh.style.setProperty('--dy',f1(q2[1]-p[1])+'px');
      var gl=fa.querySelector('.fxgoal');gl.setAttribute('x',f1(q2[0]+br+14));gl.setAttribute('y',f1(q2[1]-br-6));gl.textContent='';
      var ft=fa.querySelector('text.fixt');ft.setAttribute('x',f1(p[0]+44));ft.setAttribute('y',f1(p[1]-30));ft.textContent='The fix: move '+BN(brand)+' to picked first';}
  }
  /* ---------- The pointer from the radar to the step being explained: follows 01 > 02 > 03 > 04 as you scroll. */
  var conn=null,connY=null;
  function connLoop(){requestAnimationFrame(connLoop);
    /* step 04 used to appear only in the last few pixels of the pinned scroll; show it a little earlier */
    var secE=document.querySelector('.ss-stage');secE=secE&&secE.closest('section');
    if(secE){var sr=secE.getBoundingClientRect(),prog=-sr.top/Math.max(1,sr.height-innerHeight);document.documentElement.classList.toggle('grv-fix',prog>0.86);}
    var orig=document.querySelector('.ss-connector'),w=document.querySelector('.grv-ss');if(!orig||!w)return;
    var par=orig.parentElement,pr=par.getBoundingClientRect();if(pr.bottom<-200||pr.top>innerHeight+200)return;
    if(!conn||!conn.isConnected){conn=document.createElementNS('http://www.w3.org/2000/svg','svg');conn.setAttribute('class','grv-conn');conn.setAttribute('aria-hidden','true');conn.innerHTML='<path/><circle r="3.5"/>';par.appendChild(conn);}
    if(getComputedStyle(orig).display==='none'){conn.style.display='none';return;}conn.style.display='';
    var step=(w.className.match(/st-(\w+)/)||[])[1]||'ask';if(step==='intro')step='ask';
    var sec=document.querySelector('.lane-step[data-step="'+step+'"] .lane-node');if(!sec)return;
    var svg=w.querySelector('svg'),m=svg.getScreenCTM();if(!m)return;var a0=Q(157,SANG),pt=svg.createSVGPoint();pt.x=a0[0]+26;pt.y=a0[1];pt=pt.matrixTransform(m);
    var nr=sec.getBoundingClientRect(),nx=nr.left-pr.left,ny=nr.top+nr.height/2-pr.top,sx=pt.x-pr.left,sy=pt.y-pr.top,ex=nx-25;
    connY=connY===null?ny:connY+(ny-connY)*0.14;if(Math.abs(connY-ny)<0.3)connY=ny;
    conn.querySelector('path').setAttribute('d','M'+f1(sx)+' '+f1(sy)+'H'+f1(ex)+'V'+f1(connY)+'H'+f1(nx-2));
    var c=conn.querySelector('circle');c.setAttribute('cx',f1(nx+3.5));c.setAttribute('cy',f1(connY));}
  requestAnimationFrame(connLoop);
  /* ---------- Hand-off: the hero radar travels down and becomes the session radar. */
  var trav,prodTop=null;
  function travel(){
    var hf=document.querySelector('[class*="_poster"] [class*="_frame"]'),ss=document.querySelector('.ss-radar'),prod=document.getElementById('product');
    var hg=hf&&hf.querySelector('.grv'),sg=ss&&ss.querySelector('.grv');if(!hg||!sg||!prod)return;
    if(!trav){trav=document.createElement('div');trav.className='grv grv-trav';trav.setAttribute('aria-hidden','true');trav.innerHTML=brandSvg();document.body.appendChild(trav);}
    if(trav.dataset.b!==brand){trav.dataset.b=brand;drawBrands(trav);}
    if(prodTop===null)prodTop=prod.getBoundingClientRect().top+scrollY;
    var t=Math.max(0,Math.min(1,scrollY/Math.max(1,prodTop))),e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
    var op=1;for(var el=ss;el&&el!==document.body;el=el.parentElement){op*=parseFloat(getComputedStyle(el).opacity)||0;}
    var a=hg.getBoundingClientRect(),b0=ss.getBoundingClientRect(),k=0.115,b={left:b0.left+b0.width*k,top:b0.top+b0.height*k,width:b0.width*(1-2*k),height:b0.height*(1-2*k)};
    if(t<=0.01){hg.style.opacity='';sg.style.opacity='0';trav.style.display='none';return;}
    if(t>=0.999&&op>0.92){hg.style.opacity='0';sg.style.opacity='';trav.style.display='none';return;}
    if(t>=0.999)e=1;
    hg.style.opacity='0';sg.style.opacity='0';trav.style.display='block';
    var aT=a.top+scrollY,bT=b.top-(prodTop-scrollY);
    trav.style.left=(a.left+(b.left-a.left)*e)+'px';trav.style.top=(aT+(bT-aT)*e)+'px';trav.style.width=(a.width+(b.width-a.width)*e)+'px';trav.style.height=(a.height+(b.height-a.height)*e)+'px';
  }
  addEventListener('scroll',function(){requestAnimationFrame(travel)},{passive:true});
  addEventListener('resize',function(){prodTop=null;travel();});
  function watchHero(){var h=document.querySelector('[class*="_hero"]');if(!h||watchHero.on)return;watchHero.on=1;
    var chk=function(){document.body.classList.toggle('grv-hero-in',h.getBoundingClientRect().bottom>innerHeight*0.35)};chk();
    addEventListener('scroll',chk,{passive:true});addEventListener('resize',chk);}

  /* ---------- Sources: the page's own sector chart stays (its labels and wording); add the sweep and hover numbers. */
  var SRC=[["Rival pages",125,472,374],["Brand A's own pages",97,183,150],["Brand A listings",58,89,47],["Pages that could mention Brand A",31,35,33],["Pages that accept submissions",22,32,30],["Neutral references",15,20,12],["DIY guides",10,13,13],["Unclassified",1,2,0],["News",1,1,1]];
  function mountSources(){
    var svg=document.querySelector('.sw-radar svg');if(!svg||svg.querySelector('.grv-swp'))return;
    var NS='http://www.w3.org/2000/svg',g=document.createElementNS(NS,'g');g.setAttribute('class','grv-swp');
    var s0=[0,-100],e0=[Math.cos(-60*Math.PI/180)*100,Math.sin(-60*Math.PI/180)*100];
    var h='<defs><linearGradient id="grvBeamS" gradientUnits="userSpaceOnUse" x1="0" y1="-100" x2="'+f1(e0[0])+'" y2="'+f1(e0[1])+'"><stop offset="0" stop-color="rgba(14,74,47,0)"/><stop offset="1" stop-color="rgba(14,74,47,.22)"/></linearGradient></defs>';
    h+='<g class="sweep" style="animation-duration:'+T+'s"><path d="M0 0L0 -100A100 100 0 0 1 '+f1(e0[0])+' '+f1(e0[1])+'Z" fill="url(#grvBeamS)"/><line class="beam" x1="0" y1="0" x2="'+f1(e0[0])+'" y2="'+f1(e0[1])+'"/></g>';
    /* ring labels on the south axis, as on the other radars */
    [[25,"25%"],[50,"50%"],[75,"75%"],[100,"100% opened"]].forEach(function(l){h+='<text class="srl" x="0" y="'+(-l[0]+5)+'" text-anchor="middle">'+l[1]+'</text>';});
    SRC.forEach(function(r,i){var a0=-90+i*40,a1=a0+40,p0=[100*Math.cos(a0*Math.PI/180),100*Math.sin(a0*Math.PI/180)],p1=[100*Math.cos(a1*Math.PI/180),100*Math.sin(a1*Math.PI/180)];
      var tipH='<b>'+esc(r[0])+'</b><br>Opened in <b>'+r[1]+'</b> of 148 sessions ('+(Math.round(r[1]/1.48*10)/10)+'%)<br>'+r[2]+' reads · <b>'+(Math.round(r[3]/r[2]*1000)/10)+'%</b> cited';
      h+='<path class="swhit" data-i="'+i+'" data-tip="'+tipH.replace(/"/g,'&quot;')+'" d="M0 0L'+f1(p0[0])+' '+f1(p0[1])+'A100 100 0 0 1 '+f1(p1[0])+' '+f1(p1[1])+'Z"/>';});
    g.innerHTML=h;svg.appendChild(g);bind(svg.parentElement);svg.style.pointerEvents='auto';
    /* each sector is a type of page: a stem from the centre whose length = share of sessions that opened it
       (outer ring = 100%), ending in a dot whose brightness = share of its reads that were cited.
       The beam lights each dot as it passes, like the other radars. */
    var SC=["#D9573F","#0E4A2F","#4F8A6A","#8CA78F","#8CA78F","#8CA78F","#8CA78F","#B9B0A3","#B9B0A3"],NSs='http://www.w3.org/2000/svg';
    var bars=document.createElementNS(NSs,'g');bars.setAttribute('class','grv-bars');
    var bh='';for(var k=0;k<9;k++){var e=[100*Math.cos((-90+k*40)*Math.PI/180),100*Math.sin((-90+k*40)*Math.PI/180)];bh+='<line class="sdiv" x1="0" y1="0" x2="'+f1(e[0])+'" y2="'+f1(e[1])+'"/>';}
    SRC.forEach(function(r,i){var a=(-70+i*40)*Math.PI/180,r0=8,r1=r0+(100-r0)*(r[1]/148),cited=r[2]?r[3]/r[2]:0,d=hitAt(-70+i*40),sz=2.6+Math.sqrt(r[2])*0.32;
      var p0=[r0*Math.cos(a),r0*Math.sin(a)],p1=[r1*Math.cos(a),r1*Math.sin(a)];
      bh+='<g class="lolli"><line class="stem" x1="'+f1(p0[0])+'" y1="'+f1(p0[1])+'" x2="'+f1(p1[0])+'" y2="'+f1(p1[1])+'" style="stroke:'+SC[i]+'"/>'+
        '<circle class="lping" cx="'+f1(p1[0])+'" cy="'+f1(p1[1])+'" r="'+f1(sz+1.5)+'" style="stroke:'+SC[i]+';animation-duration:'+T+'s;animation-delay:'+d+'s"/>'+
        '<circle class="lhalo" cx="'+f1(p1[0])+'" cy="'+f1(p1[1])+'" r="'+f1(sz+3.2)+'" style="stroke:'+SC[i]+'"/>'+'<circle class="ldot" cx="'+f1(p1[0])+'" cy="'+f1(p1[1])+'" r="'+f1(sz)+'" style="fill:'+SC[i]+';fill-opacity:'+(0.35+0.65*cited).toFixed(2)+'"/>';
      /* the label sits inside the circle beside its dot: page type and share of sessions */
      var lr=Math.max(r1+sz+3,34),lp=[lr*Math.cos(a),lr*Math.sin(a)],c=Math.cos(a),sn=Math.sin(a),an=Math.abs(c)<0.3?'middle':(c>0?'start':'end');
      var NAMES=["Rival pages","Brand A's own pages","Brand A listings","Could mention Brand A","Accept submissions","Neutral references","DIY guides","Unclassified","News"];
      var ly=lp[1]+(sn>0.5?4:sn<-0.5?-4:0);
      bh+='<g class="lnum" transform="translate('+f1(p1[0]-Math.cos(a)*(sz*0.75+2.2)+Math.sin(a)*(sz*0.75+2.2))+' '+f1(p1[1]-Math.sin(a)*(sz*0.75+2.2)-Math.cos(a)*(sz*0.75+2.2))+')"><circle r="3.4"/><text y="1.35" text-anchor="middle">'+(i+1)+'</text></g>';bh+='<text class="llab'+(i===0?' rival':'')+'" x="'+f1(lp[0])+'" y="'+f1(ly)+'" text-anchor="'+an+'">'+NAMES[i]+'<tspan class="lpct" x="'+f1(lp[0])+'" dy="5.4">'+(Math.round(r[1]/1.48*10)/10)+'%</tspan></text></g>';});
    bars.innerHTML=bh;svg.insertBefore(bars,g);
    /* pointing at a page type stops the beam and swings it onto that dot; moving away lets it go round again */
    var lol=bars.querySelectorAll('.lolli'),cur=-1,tw=0,TT=T*1000;
    /* the readout under the intro follows the page type the light points at */
    var PH=["of sessions opened a rival page before picking.","of sessions opened one of Brand A's own pages.","of sessions read a Brand A listing, such as npm or G2.","of sessions opened a page that could mention Brand A.","of sessions opened a page that accepts submissions.","of sessions opened a neutral reference page.","of sessions opened a DIY guide.","of sessions opened a page we could not classify.","of sessions opened a news article."];
    var RN=["Rival pages","Brand A's own pages","Brand A listings (npm, G2, directories)","Pages that could mention Brand A","Pages that accept submissions","Neutral references","DIY guides","Unclassified","News"];
    var pc=function(n){var v=Math.round(n*10)/10;return (v%1===0?v.toFixed(0):v.toFixed(1))+'%'};
    var rd=null;function readout(i){var st=document.querySelector('.sw-stops');if(!st)return;
      if(!rd||!rd.isConnected){rd=document.createElement('div');rd.className='grv-read border-t border-rule pt-4';rd.setAttribute('aria-live','polite');st.appendChild(rd);}
      var r=SRC[i],col=i===0?'text-amber':(i<4?'text-phosphor':'text-bone');
      rd.innerHTML='<p class="font-mono text-[11px] uppercase leading-4 tracking-[0.08em] text-mist"><span class="tabular-nums">'+(i<9?'0':'')+(i+1)+'</span> / 09 <span class="text-rule">/</span> '+esc(RN[i])+'</p>'+
        '<p class="mt-3 text-[16px] leading-[26px] text-bone md:text-[17px]"><span class="font-mono tabular-nums '+col+' mr-2 text-[30px] leading-[34px] tracking-[-0.02em] md:text-[34px]">'+pc(r[1]/1.48)+'</span>'+PH[i]+'</p>'+
        '<p class="mt-2 font-mono text-[12px] leading-[18px] tabular-nums text-mist">'+pc(r[3]/r[2]*100)+' of '+r[2]+(r[2]===1?' read was':' reads were')+' cited.</p>';
      document.documentElement.classList.add('grv-aim');}
    function anims(){return (svg.getAnimations?svg.getAnimations({subtree:true}):[]).filter(function(x){return x.animationName==='grvSpin'||x.animationName==='grvPing'});}
    function aim(i){if(i===cur)return;cur=i;svg.classList.add('aiming');lol.forEach(function(l,k){l.classList.toggle('focus',k===i)});
      readout(i);var A=anims();if(!A.length)return;A.forEach(function(x){x.pause()});
      var sw=A.filter(function(x){return x.animationName==='grvSpin'})[0]||A[0],c=+sw.currentTime||0;
      var tgt=+hitAt(-70+i*40)*1000,ph=((c%TT)+TT)%TT,d=((tgt-ph)%TT+TT)%TT;if(d>TT/2)d-=TT;
      var c0=c,end=c+d;if(end<TT)end+=TT;var st=performance.now(),id=++tw;
      (function step(now){if(id!==tw)return;var k=Math.min(1,(now-st)/380),e=1-Math.pow(1-k,3),v=c0+(end-c0)*e;
        A.forEach(function(x){x.currentTime=v});if(k<1)requestAnimationFrame(step);})(st);}
    function release(){if(cur<0)return;cur=-1;document.documentElement.classList.remove('grv-aim');tw++;svg.classList.remove('aiming');lol.forEach(function(l){l.classList.remove('focus')});anims().forEach(function(x){x.play()});}
    var wrapEl=svg.parentElement;
    wrapEl.addEventListener('mouseover',function(e){var t=e.target.closest&&e.target.closest('.swhit');t?aim(+t.getAttribute('data-i')):release();});
    wrapEl.addEventListener('mouseleave',release);
    wrapEl.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('.swhit');if(t)aim(+t.getAttribute('data-i'));});
    addEventListener('scroll',function(){if(cur>=0&&!wrapEl.matches(':hover'))release();},{passive:true});
  }
  /* ---------- Field report plate: the page's own plate, plus hover detail on every session dot. */
  function mountPlate(){
    /* Plate 1, summarised: one dot per topic per ring instead of one per session.
       Ring = where Brand X landed (centre: named first / picked first, then 2nd, 3rd, 4th or lower, outside the rim: not named).
       Dot size and the number in it = how many of that topic's sessions landed there. */
    var host=document.querySelector('#field-report [class*="max-w-[620px]"]');if(!host||host.querySelector('.grv'))return;
    var w=document.createElement('div');w.className='grv grv-plate';var s=sessSvg();w.innerHTML=s;host.appendChild(w);bind(w);
    var sv=w.querySelector('svg'),z=document.createElementNS('http://www.w3.org/2000/svg','circle');z.setAttribute('class','zone');z.setAttribute('r','600');sv.insertBefore(z,sv.firstChild);var NSp='http://www.w3.org/2000/svg',dsc=sv.querySelector('.disc');[[375,'b4'],[250,'b3'],[125,'b2']].forEach(function(q){var c=document.createElementNS(NSp,'circle');c.setAttribute('class','pband '+q[1]);c.setAttribute('r',q[0]);dsc.parentNode.insertBefore(c,dsc.nextSibling);});
    /* one dot per ring: how many of the 148 sessions put Brand X there. Brand X colours only (no competitor red). */
    var BR_={1:96,2:188,3:312,4:438,0:552},RT={1:'Picked first',2:'Named 2nd',3:'Named 3rd',4:'Named 4th or lower',0:'Not named'};
    var COLB={1:'#0E4A2F',2:'#3F7A5A',3:'#6E9A7E',4:'#9DB78E',0:'#B9B0A3'};
    var rt={},bt={};SESS.forEach(function(x){var b=posOf(x,'A');b=b>=4?4:b;rt[b]=(rt[b]||0)+1;bt[b]=bt[b]||{};bt[b][x[0]]=(bt[b][x[0]]||0)+1;});
    var pc=function(n){var v=Math.round(n/1.48*10)/10;return (v%1===0?v.toFixed(0):v.toFixed(1))+'%'};
    var h='';
    /* each ring carries a gauge: an arc from 12 o'clock whose length is that outcome's share of the 148 sessions; the dot sits at its end */
    /* the five outcomes laid end to end round the circle, each on its own ring: arc length = share of the 148 sessions,
       so together they close the full circle. The dot sits mid-arc. */
    var ANGP={},A0={},A1={},acc=-90;[1,2,3,4,0].forEach(function(b){A0[b]=acc;acc+=360*(rt[b]||0)/148;A1[b]=acc;ANGP[b]=(A0[b]+A1[b])/2;});
    [1,2,3,4,0].forEach(function(b){var R0=BR_[b],p0=Q(R0,A0[b]+1.5),p1=Q(R0,A1[b]-1.5),lg=(A1[b]-A0[b])>180?1:0,L=Math.PI*R0*(A1[b]-A0[b]-3)/180;
      h+='<path class="parc" d="M'+f1(p0[0])+' '+f1(p0[1])+'A'+R0+' '+R0+' 0 '+lg+' 1 '+f1(p1[0])+' '+f1(p1[1])+'" style="stroke:'+COLB[b]+';stroke-dasharray:'+f1(L)+' 9999;--L:'+f1(L)+'"/>';
      var e0=Q(R0-16,A0[b]),e1=Q(R0+16,A0[b]);h+='<line class="ptick" x1="'+f1(e0[0])+'" y1="'+f1(e0[1])+'" x2="'+f1(e1[0])+'" y2="'+f1(e1[1])+'"/>';});
    [0,1,2,3,4].forEach(function(b){var n=rt[b]||0,r=12+Math.sqrt(n)*3.4,p=Q(BR_[b],ANGP[b]),d=hitAt(ANGP[b]);
      var tipH='<b>Brand X '+RT[b].toLowerCase()+'</b> · '+n+' of 148 sessions ('+pc(n)+')<br>'+[0,1,2,3,4,5].filter(function(t){return bt[b][t]}).map(function(t){return TOP[t]+': '+bt[b][t]}).join('<br>');
      h+='<g class="pd b'+b+'" style="transition-delay:'+(0.25+[1,2,3,4,0].indexOf(b)*0.22)+'s" tabindex="0" role="button" data-tip="'+tipH.replace(/"/g,'&quot;')+'" aria-label="Brand X '+RT[b]+': '+n+' of 148 sessions">'+
        '<circle class="ping" cx="'+f1(p[0])+'" cy="'+f1(p[1])+'" r="'+f1(r+6)+'" style="stroke:'+COLB[b]+';animation-duration:'+T+'s;animation-delay:'+d+'s"/>'+
        '<circle class="b" cx="'+f1(p[0])+'" cy="'+f1(p[1])+'" r="'+f1(r)+'" style="fill:'+COLB[b]+'"/><text class="pn" data-n="'+n+'" x="'+f1(p[0])+'" y="'+f1(p[1]+10)+'">'+n+'</text>'+
        '<text class="prk'+(b===1?' first':'')+'" x="'+f1(b===3||b===4?p[0]:p[0]>300?p[0]-r-16:p[0]+r+16)+'" y="'+f1(b===3?p[1]+r+36:b===4?p[1]-r-16:p[1]+10)+'" style="text-anchor:'+(b===3||b===4?'middle':p[0]>300?'end':'start')+'">'+RT[b]+' · '+pc(n)+'</text></g>';});
    w.querySelector('.dots').innerHTML=h;
    /* builds when it scrolls into view: rings shade in, dots pop in from the centre out, numbers count up */
    var inV=false;new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&!inV){inV=true;w.classList.remove('in');void w.offsetWidth;w.classList.add('in');
        w.querySelectorAll('text.pn').forEach(function(tx,ix){var n=+tx.dataset.n,st=performance.now()+250+ix*220;(function f(now){var q=Math.max(0,Math.min(1,(now-st)/900));tx.textContent=String(Math.round(n*(1-Math.pow(1-q,3))));if(q<1)requestAnimationFrame(f);})(performance.now());});}
      else if(!e.isIntersecting)inV=false;});},{threshold:.35}).observe(w);
  }

