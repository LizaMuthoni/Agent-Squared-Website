  /* Colour the question readout's dots by who was picked, using the radar's colours:
     the brand in view = dark green, its biggest rival = red, the other = amber, any other vendor = grey. */
  function colorQDots(){
    var meta=document.querySelector('[class*="_qmeta"]'),m=meta&&/Q\s*(\d+)\s*of\s*48/.exec(meta.textContent);if(!m)return;
    var qn=+m[1],t=STUDY[Math.floor((qn-1)/8)],q=(qn-1)%8;
    var rivals=BR.filter(function(b){return b!==brand}).sort(function(a,b){return OVER[b][0]-OVER[a][0]});
    var col={O:"#B9B0A3"};col[brand]=FOCUS;col[rivals[0]]="#D9573F";col[rivals[1]]="#E3A33A";
    document.querySelectorAll('li[class*="_qresult"]').forEach(function(li){
      var l=li.querySelector('[class*="_qletter"]'),dot=li.querySelector('[class*="_qdot"]');if(!l||!dot)return;
      var ph="ABC".indexOf(l.textContent.trim());if(ph<0)return;
      for(var i=0;i<SESS.length;i++){var x=SESS[i];if(x[0]===t&&x[1]===q&&x[2]===ph&&!x[7]){var c=col[x[6]];if(dot.style.backgroundColor!==c){dot.style.backgroundColor=c;dot.title='Picked '+(x[6]==='O'?'another vendor':'Brand '+x[6]);}break;}}
    });
  }
