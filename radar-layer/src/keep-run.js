  var RUN={A:[107,49],B:[31,19],C:[40,11]}; /* named, picked first, of 148 */
  function runSvg(example){
    var s='<svg viewBox="-20 -10 440 420" role="img" aria-label="'+(example?'Example of the next run: Brand A moving closer to the centre':'This run: Brand A named in 107 of 148 sessions, Brand B in 31, Brand C in 40')+'">';
    s+='<circle class="disc" cx="200" cy="200" r="'+R+'"/>';[25,50,75].forEach(function(v){s+='<circle class="ring" cx="200" cy="200" r="'+f1((1-v/100)*R)+'"/>';});
    s+='<circle class="ring" cx="200" cy="200" r="'+R+'"/>';
    var ANG={A:-40,B:70,C:190};
    BR.forEach(function(b){var named=100*RUN[b][0]/148,first=100*RUN[b][1]/148,dist=(1-named/100)*R,p=P(dist,ANG[b]),sz=5+first*0.35,col=b==='A'?FOCUS:(b==='B'?'#D9573F':'#E3A33A');
      if(example&&b==='A'){var np=P(dist*0.45,ANG[b]);s+='<line class="trail" x1="'+f1(p[0])+'" y1="'+f1(p[1])+'" x2="'+f1(np[0])+'" y2="'+f1(np[1])+'"/><circle class="ghost" cx="'+f1(p[0])+'" cy="'+f1(p[1])+'" r="'+f1(sz)+'"/>';p=np;sz+=4;}
      var c=Math.cos(ANG[b]*Math.PI/180);
      s+='<g class="blip run'+(b==='A'?' focus':'')+'">'+'<circle class="b" cx="'+f1(p[0])+'" cy="'+f1(p[1])+'" r="'+f1(sz)+'" style="fill:'+col+'"/><text x="'+f1(p[0]+(c>=0?sz+7:-sz-7))+'" y="'+f1(p[1]+5)+'" text-anchor="'+(c>=0?'start':'end')+'"'+(b==='A'?' class="fa"':'')+'>Brand '+b+'</text></g>';});
    return s+'</svg>';
  }
