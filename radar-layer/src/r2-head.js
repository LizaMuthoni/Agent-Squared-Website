/* GEO Radar restyle layer for the georadar draft. Keeps every original label and line of copy;
   only redraws the radars in the GEO Radar app style and makes each dot carry data.
   Session radars use the page's own geometry (viewBox -500..500): centre = picked first,
   rings out to 500 = named 2nd, 3rd, 4th+, beyond the rim = not seen. Angle = topic slice,
   then question, then phrasing. Data: the study's own 148 session records. */
(function(){
  var cx=200,cy=200,R=165,T=6,tip,brand="A";
  /* desktop pinned layout (matches the page's own breakpoint); below it sections stack */
  var PINQ='(min-width: 1024px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)';function pinned(){return matchMedia(PINQ).matches;}
  var f1=function(n){return Math.round(n*10)/10};
  var P=function(r,deg){var a=deg*Math.PI/180;return[cx+r*Math.cos(a),cy+r*Math.sin(a)]};
  var Q=function(r,deg){var a=deg*Math.PI/180;return[r*Math.cos(a),r*Math.sin(a)]};
  var BR=["A","B","C"],COL={A:"#4F8FC9",B:"#E07A5F",C:"#E3A33A",O:"#B9B0A3"},FOCUS="#0E4A2F";
  var TOP=["Upload UX","Video API","Agentic media","Digital asset management","Image API","Moderation and tagging"];
  var STUDY=[2,3,4,5,0,1]; /* the page numbers topics 1..6 as Agentic media, DAM, Image API, Moderation, Upload UX, Video API */
  var WHO={A:"Brand A",B:"Brand B",C:"Brand C",O:"another vendor"};
  var esc=function(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')};
  var ord=function(n){return n===2?'2nd':n===3?'3rd':n+'th'};
