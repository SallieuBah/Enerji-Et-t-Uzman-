(function(){
const DATA=window.PORTFOY,L=window.I18N?window.I18N.L:(tr)=>tr,EN=window.I18N&&window.I18N.lang==="en";
const F=DATA.F.map(f=>({...f,sc:f.sc.filter(x=>x!=="Etüt Yazılımı")})),M=DATA.M,C=DATA.C;
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const fmt=n=>n.toLocaleString(EN?"en-US":"tr-TR");
const AY=EN?["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];
const AYL=EN?["January","February","March","April","May","June","July","August","September","October","November","December"]:["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
const ym=k=>{const[y,m]=k.split("-");return AYL[+m-1]+" "+y};
const tc0=s=>s.toLocaleLowerCase("tr-TR").replace(/(^|[\s(\/-])(\S)/g,(a,b,c)=>b+c.toLocaleUpperCase("tr-TR"));
const tc=s=>EN?({AZERBAYCAN:"Azerbaijan","Belirtilmemiş":"Not specified"}[s]||tc0(s)):tc0(s);
/* Excel'deki Türkçe sektör ve kapsam adlarının İngilizce karşılıkları */
const SEC_EN={"Metal, Otomotiv & Makine":"Metal, Automotive & Machinery","Otel, Ticari & Kamu":"Hotels, Commercial & Public","Gıda & İçecek":"Food & Beverage","Tekstil":"Textiles","Kimya, Plastik & İlaç":"Chemicals, Plastics & Pharma","Cam, Seramik, Çimento & Maden":"Glass, Ceramics, Cement & Mining","Kağıt & Ambalaj":"Paper & Packaging","Diğer Sanayi":"Other Industry"};
const SC_EN={"Trafo":"Transformer","Elektrik Motoru":"Electric Motor","Pompa":"Pump","Termal Kamera":"Thermal Imaging","Buhar Sistemleri":"Steam Systems","Basınçlı Hava":"Compressed Air"};
const secN=s=>EN?SEC_EN[s]||s:s,scN=s=>EN?SC_EN[s]||s:s;
const sum=(a,f)=>a.reduce((t,x)=>t+f(x),0);
const nF=F.length,field=F.filter(f=>f.s>0),both=F.filter(f=>f.t==="Saha Etüdü + Rapor");
const sDays=sum(M,m=>m[1]),rDays=sum(M,m=>m[2]);
const abroad=F.filter(f=>f.c==="AZERBAYCAN").length;
const has=k=>F.filter(f=>f.sc.includes(k)).length;
const sc={};F.forEach(f=>sc[f.sec]=(sc[f.sec]||0)+1);
const SE=Object.entries(sc).filter(([k])=>k!=="Diğer Sanayi").sort((a,b)=>b[1]-a[1]);
if(sc["Diğer Sanayi"])SE.push(["Diğer Sanayi",sc["Diğer Sanayi"]]);

/* Hero */
$("#period").textContent=M[0][0].slice(0,4)+"–"+M[M.length-1][0].slice(0,4);
$("#lede").innerHTML=L(`Sanayi tesislerinde enerji verimliliği etütleri yürütüyor, ölçüm verisini yatırım kararına dönüşen teknik raporlara çeviriyorum. <b>${fmt(nF)} tesis</b>, <b>${C.length} il</b> ve <b>${abroad} yurt dışı projesi</b>.`,`I run energy efficiency audits in industrial facilities and turn measurement data into technical reports that drive investment decisions. <b>${fmt(nF)} facilities</b>, <b>${C.length} provinces</b> and <b>${abroad} international projects</b>.`);
$("#tags").innerHTML=(EN?["Transformer efficiency analysis","Electric motor assessment","Pump systems","Steam and compressed air","On-site measurement"]:["Trafo verimlilik analizi","Elektrik motoru değerlendirmesi","Pompa sistemleri","Buhar ve basınçlı hava","Saha ölçümü"]).map(t=>`<span class="tag">${t}</span>`).join("");
$("#kpis").innerHTML=[[nF,"",L("Tesis portföyü","Facility portfolio")],[sDays,"f",L("Saha etüdü günü","Field audit days")],[rDays,"c",L("Rapor çalışma günü","Report writing days")],[C.length,"",L("İlde saha çalışması","Provinces with field work")]]
 .map(k=>`<div class="kpi"><b class="${k[1]}">${fmt(k[0])}</b><span>${k[2]}</span></div>`).join("");
(function(){const v=M.map(m=>m[1]+m[2]),f=M.map(m=>m[1]),mx=Math.max(...v),n=M.length;
 const pt=(a,i)=>[(i/(n-1))*1000,112-(a/mx)*96];
 const path=a=>{let d="";a.forEach((x,i)=>{const[X,Y]=pt(x,i);if(!i)d=`M${X},${Y}`;else{const[pX,pY]=pt(a[i-1],i-1),cx=(pX+X)/2;d+=` C${cx},${pY} ${cx},${Y} ${X},${Y}`}});return d};
 const p=path(v);
 $("#wave").innerHTML=`<defs><linearGradient id="wg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--glow)" stop-opacity=".28"/><stop offset="1" stop-color="var(--glow)" stop-opacity="0"/></linearGradient></defs><path class="a" d="${p} L1000,120 L0,120 Z"/><path class="l" d="${p}"/><path class="l2" d="${path(f)}"/>`;})();

/* Neden */
$("#why").innerHTML=[
 [both.length,"",L("Uçtan uca etüt","End-to-end audits"),L("Aynı tesiste saha ölçümünü yapıp raporu da yazdığım proje sayısı.","Projects where I did both the on-site measurement and the report.")],
 [SE.length-(sc["Diğer Sanayi"]?1:0),"",L("Sektör deneyimi","Sectors"),L("Metal ve otomotivden gıdaya, tekstilden otel ve AVM'lere kadar.","From metal and automotive to food, from textiles to hotels and malls.")],
 [C.length,"",L("İlde sahadayım","Provinces on site"),L("İstanbul ve Kocaeli'den Adana, Kayseri ve Samsun'a uzanan saha çalışması.","Field work from Istanbul and Kocaeli to Adana, Kayseri and Samsun.")],
 [abroad,"",L("Uluslararası proje","International projects"),L("Azerbaycan'da sanayi, otel ve sağlık tesislerine yönelik raporlar.","Reports for industrial, hotel and healthcare facilities in Azerbaijan.")]]
 .map(w=>`<div><b>${w[0]}${w[1]}</b><h3>${w[2]}</h3><p>${w[3]}</p></div>`).join("");

/* Uzmanlık */
const pbh=F.filter(f=>f.sc.some(x=>["Pompa","Buhar Sistemleri","Basınçlı Hava"].includes(x))).length;
const SK=[
 [has("Trafo"),"lead",L("Trafo verimlilik raporları","Transformer efficiency reports"),L("Transformatör kayıp ve yüklenme değerlendirmeleri. Portföyümün ana uzmanlık hattı.","Transformer loss and loading assessments. The core of my portfolio.")],
 [field.length,"f",L("Saha etüdü","Field audits"),L(`${C.length} ilde, ${fmt(sDays)} gün süren yerinde inceleme ve ölçüm.`,`${fmt(sDays)} days of on-site inspection and measurement across ${C.length} provinces.`)],
 [has("Elektrik Motoru"),"",L("Elektrik motoru değerlendirmesi","Electric motor assessment"),L("Motor envanteri ve verimli motor dönüşümüne yönelik raporlar.","Motor inventories and reports on upgrading to high-efficiency motors.")],
 [pbh,"",L("Pompa, buhar ve basınçlı hava","Pumps, steam and compressed air"),L("Pompa sistemleri, buhar jeneratörü ve hava kaçağı değerlendirmeleri.","Assessments of pump systems, steam generators and compressed air leaks.")]];
const pct=v=>L(`Portföyün %${Math.round(v/nF*100)}'i`,`${Math.round(v/nF*100)}% of the portfolio`);
$("#skills").innerHTML=SK.map(s=>`<div class="skill ${s[1]}"><strong>${s[0]}</strong><h3>${s[2]}</h3><p>${s[3]}</p><div class="meter" role="img" aria-label="${pct(s[0])}"><i style="width:${(s[0]/nF*100).toFixed(1)}%"></i></div><span class="pct">${pct(s[0])}</span></div>`).join("");

/* Aylık grafik */
(function(){
 const W=1000,H=300,PL=34,R=8,T=14,B=46,cw=(W-PL-R)/M.length,bw=cw*.6;
 const mx=Math.max(...M.map(m=>m[1]+m[2]));const top=Math.ceil(mx/5)*5;
 const y=v=>T+(H-T-B)*(1-v/top);
 let g="";
 for(let v=0;v<=top;v+=5){g+=`<line class="grid" x1="${PL}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}"/><text x="${PL-8}" y="${y(v)+4}" text-anchor="end">${v}</text>`}
 M.forEach((m,i)=>{const x=PL+i*cw+(cw-bw)/2,[k,s,r]=m,[yy,mm]=k.split("-");
  if(s)g+=`<rect class="bf" x="${x}" y="${y(s)}" width="${bw}" height="${y(0)-y(s)}" rx="2"/>`;
  if(r)g+=`<rect class="br" x="${x}" y="${y(s+r)}" width="${bw}" height="${y(s)-y(s+r)-(s?1.5:0)}" rx="2"/>`;
  if((+mm-1)%3===0)g+=`<text x="${x+bw/2}" y="${H-B+18}" text-anchor="middle">${AY[+mm-1]}</text>`;
  if(mm==="01"||i===0)g+=`<text x="${x+bw/2}" y="${H-B+34}" text-anchor="middle" style="fill:var(--ink);font-weight:500">${yy}</text>`;
  g+=`<rect class="hit" data-i="${i}" x="${PL+i*cw}" y="${T}" width="${cw}" height="${H-T-B}"/>`});
 $("#monthly").innerHTML=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${L("Aylık saha ve rapor günleri","Monthly field and report days")}">${g}</svg>`;
 const tip=$("#tip");
 $("#monthly").addEventListener("pointermove",e=>{const i=e.target.dataset&&e.target.dataset.i;if(i==null){tip.hidden=true;return}
  const m=M[+i];tip.innerHTML=`${ym(m[0])}<br>`+L(`Saha ${m[1]} gün · Rapor ${m[2]} gün`,`Field ${m[1]} days · Report ${m[2]} days`);tip.hidden=false;
  const w=tip.offsetWidth;tip.style.left=Math.min(e.clientX+12,innerWidth-w-12)+"px";tip.style.top=(e.clientY-52)+"px"});
 $("#monthly").addEventListener("pointerleave",()=>tip.hidden=true);
 const PH=EN?{"2024":"Reporting foundation","2025":"Moving to the field","2026":"Leading in the field"}:{"2024":"Raporlama temeli","2025":"Sahaya geçiş","2026":"Saha liderliği"};
 $("#phases").innerHTML=Object.keys(PH).map(y=>{const a=M.filter(m=>m[0].startsWith(y)),s=sum(a,m=>m[1]),r=sum(a,m=>m[2]);
  return `<div class="phase"><b>${y}</b><h3>${PH[y]}</h3><div class="bar2"><span class="s" style="flex:${s}"></span><span class="r" style="flex:${r}"></span></div><p class="num">${L(`${s} saha günü · ${r} rapor günü`,`${s} field days · ${r} report days`)}</p></div>`}).join("");
})();

/* Sektörler */
const smax=SE[0][1];
$("#sectors").innerHTML=SE.map(([k,v])=>`<div class="row sec"><span class="lbl">${esc(secN(k))}</span><span class="bar"><i style="width:${v/smax*100}%"></i></span><span class="v">${v}</span></div>`).join("")+
 `<p class="note" style="margin-top:16px">${L(`Saha etüdü yapılan tesis: ${field.length} · yalnız rapor: ${nF-field.length}`,`Facilities with field audits: ${field.length} · report only: ${nF-field.length}`)}</p>`;
SE.forEach(([k])=>{const o=document.createElement("option");o.value=k;o.textContent=secN(k);$("#sec").appendChild(o)});

/* Kartlar */
const dfmt=s=>{const[y,m]=s.split("-");return `${AY[+m-1]} ${y}`};
const per=f=>{const a=dfmt(f.a),b=dfmt(f.b);return a===b?a:a+" – "+b};
$("#cards").innerHTML=both.slice().sort((a,b)=>b.k-a.k||b.s-a.s).slice(0,6).map((f,i)=>`<article class="card">
 <div class="hd"><div class="meta"><span>${esc(tc(f.c))}</span><span class="rk">0${i+1}</span></div><h3>${esc(f.n)}</h3>
 <div class="split" role="img" aria-label="${L(`${f.s} saha, ${f.r} rapor günü`,`${f.s} field, ${f.r} report days`)}"><span class="s" style="flex:${f.s}"></span><span class="r" style="flex:${f.r}"></span></div></div>
 <div class="bd"><dl><div><dt>${L("Saha","Field")}</dt><dd>${f.s}<small>${L("gün","days")}</small></dd></div><div><dt>${L("Rapor","Report")}</dt><dd>${f.r}<small>${L("gün","days")}</small></dd></div><div><dt>${L("Kayıt","Records")}</dt><dd>${f.k}</dd></div></dl>
 <div class="chips"><span class="chip f">${L("Saha etüdü","Field audit")}</span>${f.sc.map(x=>`<span class="chip">${esc(scN(x))}</span>`).join("")}</div>
 <p class="note when">${esc(secN(f.sec))} · ${per(f)}</p></div></article>`).join("");

/* Referans şeridi */
const names=F.slice().sort((a,b)=>b.k-a.k).slice(0,28).map(f=>f.n.replace(/\s*\(.*?\)\s*/g," ").replace(/\s+/g," ").trim());
const half=names.map(n=>`<span>${esc(n)}</span>`).join("");
$("#track").innerHTML=half+half.replace(/<span>/g,'<span aria-hidden="true">');

/* Tablo */
const st={q:"",t:"",sec:"",k:"k",dir:-1,all:false};
const pill=t=>t==="Saha Etüdü + Rapor"?`<span class="pill both">${L("Saha + Rapor","Field + Report")}</span>`:t==="Saha Etüdü"?`<span class="pill saha">${L("Saha","Field")}</span>`:`<span class="pill rapor">${L("Rapor","Report")}</span>`;
function draw(){
 const q=st.q.toLocaleLowerCase("tr-TR");
 let r=F.filter(f=>(!q||(f.n+" "+f.c).toLocaleLowerCase("tr-TR").includes(q))&&(!st.t||f.t===st.t)&&(!st.sec||f.sec===st.sec));
 r.sort((a,b)=>{const x=a[st.k],y=b[st.k];return (typeof x==="number"?x-y:String(x).localeCompare(String(y),"tr"))*st.dir||b.k-a.k});
 const n=r.length,show=st.all?r:r.slice(0,12);
 $("#tb").innerHTML=show.map(f=>`<tr><td><strong style="font-weight:600">${esc(f.n)}</strong><span class="sub">${esc(secN(f.sec))}</span></td><td>${esc(tc(f.c))}</td><td>${pill(f.t)}</td><td>${f.sc.length?esc(f.sc.map(scN).join(", ")):`<span class="sub">${L("Saha etüdü","Field audit")}</span>`}</td><td class="n">${f.s||"–"}</td><td class="n">${f.r||"–"}</td><td class="m">${per(f)}</td></tr>`).join("")||`<tr><td colspan="7" style="color:var(--muted)">Bu filtrelerle eşleşen tesis yok. Aramayı kısaltmayı veya filtreyi “Tümü” yapmayı deneyin.</td></tr>`;
 $("#count").textContent=L(`${show.length} / ${n} tesis gösteriliyor`,`Showing ${show.length} of ${n} facilities`);
 $("#more").hidden=n<=12;$("#more").textContent=st.all?L("İlk 12'ye dön","Show first 12"):L("Tümünü göster","Show all")+" ("+n+")";
}
$("#q").addEventListener("input",e=>{st.q=e.target.value;draw()});
$("#sec").addEventListener("change",e=>{st.sec=e.target.value;draw()});
$("#seg").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;st.t=b.dataset.v;
 $("#seg").querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));draw()});
document.querySelectorAll("th button").forEach(b=>b.addEventListener("click",()=>{const k=b.dataset.k;
 st.dir=st.k===k?-st.dir:(typeof F[0][k]==="number"?-1:1);st.k=k;draw()}));
$("#more").addEventListener("click",()=>{st.all=!st.all;draw()});
draw();
$("#foot").textContent=L(`${fmt(nF)} tesis · ${fmt(sDays+rDays)} görev günü`,`${fmt(nF)} facilities · ${fmt(sDays+rDays)} task days`);

/* Türkiye haritası */
(function(){
 const T=window.TURKIYE,V=DATA.V||[],svg=$("#map");if(!T||!svg)return;
 const NS="http://www.w3.org/2000/svg",el=(n,a)=>{const e=document.createElementNS(NS,n);for(const k in a)e.setAttribute(k,a[k]);return e};
 svg.setAttribute("viewBox",`0 0 ${T.w} ${T.h}`);
 const days={},facs={},first={};
 V.forEach(([d,f,p])=>{days[p]=(days[p]||0)+1;(facs[p]=facs[p]||{})[f]=(facs[p][f]||0)+1;if(!first[p])first[p]=d});
 const rep={};F.filter(f=>f.p&&f.s===0).forEach(f=>(rep[f.p]=rep[f.p]||[]).push(f));
 const dmax=Math.max(...Object.values(days)),op=n=>.3+.7*Math.sqrt(n/dmax);
 const nField=Object.keys(days).length,nAll=new Set([...Object.keys(days),...Object.keys(rep)]).size;
 $("#mFieldN").textContent=nField;$("#mAllN").textContent=nAll;
 const gP=el("g",{}),gD=el("g",{}),gL=el("g",{}),gR=el("g",{});svg.append(gP,gD,gL,gR);
 const P={};
 Object.entries(T.p).forEach(([name,[d,cx,cy]])=>{
  const act=days[name]||rep[name],path=el("path",{d,class:"pv"+(act?" act":"")});
  if(act){path.setAttribute("tabindex","0");path.setAttribute("role","button");path.setAttribute("aria-label",name)}
  gP.append(path);P[name]={path,cx,cy};
 });
 Object.keys(days).forEach(n=>{const{cx,cy}=P[n];gD.append(el("circle",{class:"ring",cx,cy,r:4,style:`animation-delay:${(Math.random()*2.6).toFixed(2)}s`}),el("circle",{class:"dot",cx,cy,r:2.2}))});
 Object.entries(days).sort((a,b)=>b[1]-a[1]).slice(0,6).forEach(([n])=>{const{cx,cy}=P[n],t=el("text",{class:"lbl",x:cx+6,y:cy-6});t.textContent=n;gL.append(t)});
 function paint(cnt){Object.entries(P).forEach(([n,{path}])=>{const c=cnt[n]||0;
  path.classList.toggle("f",c>0);path.classList.toggle("r",!c&&!!rep[n]&&cnt===days);
  path.style.fillOpacity=c?op(c):""})}
 const dlabel=d=>{const[y,m]=d.split("-");return AY[+m-1]+" "+y};
 function panel(n){
  Object.values(P).forEach(p=>p.path.classList.remove("sel"));if(P[n])P[n].path.classList.add("sel");
  const f=facs[n]||{},r=rep[n]||[],fl=Object.entries(f).sort((a,b)=>b[1]-a[1]);
  $("#mpanel").innerHTML=`<span class="k">${days[n]?L("Saha etüdü yapılan il","Province with field audits"):L("Rapor hazırlanan il","Province with reports")}</span><h3>${esc(n)}</h3>
   <div class="st"><div><b>${days[n]||0}</b><span>${L("saha günü","field days")}</span></div><div class="c"><b>${fl.length+r.length}</b><span>${L("tesis","facilities")}</span></div></div>
   ${fl.length?`<span class="k">${L("Sahada çalışılan tesisler","Facilities audited on site")}</span><ul>${fl.map(([x,c])=>`<li>${esc(x)}<span>${c} ${L("gün","d")}</span></li>`).join("")}</ul>`:""}
   ${r.length?`<span class="k">${L("Rapor hazırlanan tesisler","Facilities with reports")}</span><ul>${r.map(x=>`<li>${esc(x.n)}<span>${x.r} ${L("gün","d")}</span></li>`).join("")}</ul>`:""}
   ${first[n]?`<p class="hint">${L("İlk saha ziyareti","First field visit")}: ${dlabel(first[n])}</p>`:""}`;
 }
 svg.addEventListener("click",e=>{const n=Object.keys(P).find(k=>P[k].path===e.target);if(n&&(days[n]||rep[n]))panel(n)});
 svg.addEventListener("keydown",e=>{if(e.key!=="Enter"&&e.key!==" ")return;const n=Object.keys(P).find(k=>P[k].path===e.target);if(n){e.preventDefault();panel(n)}});
 const rest=()=>{paint(days);gD.style.display=gL.style.display="";$("#mDate").textContent=dlabel(V[0][0])+" – "+dlabel(V[V.length-1][0]);
  $("#mCount").textContent=L(`${nField} il · ${V.length} saha günü`,`${nField} provinces · ${V.length} field days`);$("#mProg").style.width="100%"};
 rest();panel(Object.entries(days).sort((a,b)=>b[1]-a[1])[0][0]);
 /* Yolculuk animasyonu */
 const btn=$("#play");let timer=null;
 function stop(){clearInterval(timer);timer=null;btn.setAttribute("aria-pressed","false");btn.querySelector(".lbl").textContent=L("Yolculuğu oynat","Play the journey");btn.querySelector(".ico").textContent="▶";rest()}
 btn.addEventListener("click",()=>{
  if(timer)return stop();
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches,cnt={};let i=0;
  btn.setAttribute("aria-pressed","true");btn.querySelector(".lbl").textContent=L("Durdur","Stop");btn.querySelector(".ico").textContent="■";
  gD.style.display=gL.style.display="none";paint(cnt);
  timer=setInterval(()=>{
   if(i>=V.length){clearInterval(timer);timer=null;setTimeout(stop,900);return}
   const[d,f,p]=V[i++];cnt[p]=(cnt[p]||0)+1;paint(cnt);
   if(!reduce){const{cx,cy}=P[p],r=el("circle",{class:"ripple",cx,cy,r:5});gR.append(r);setTimeout(()=>r.remove(),1000)}
   $("#mDate").textContent=dlabel(d);$("#mCount").textContent=L(`${Object.keys(cnt).length} il · ${i} saha günü`,`${Object.keys(cnt).length} provinces · ${i} field days`);
   $("#mProg").style.width=(i/V.length*100)+"%";
   if(cnt[p]===1)panel(p);
  },reduce?20:70);
 });
})();

/* E-posta kopyalama */
document.querySelectorAll("button.copy").forEach(b=>b.addEventListener("click",()=>{
 const t=b.dataset.copy,done=()=>{b.textContent=L("Kopyalandı","Copied");b.classList.add("ok");setTimeout(()=>{b.textContent=L("Kopyala","Copy");b.classList.remove("ok")},1800)};
 const sel=()=>{const r=document.createRange();r.selectNodeContents(b.parentElement.querySelector(".ci-v"));const s=getSelection();s.removeAllRanges();s.addRange(r)};
 if(navigator.clipboard)navigator.clipboard.writeText(t).then(done,sel);else sel()}));
$("#badgeN").textContent=fmt(nF);

/* Menüde aktif bölüm */
const links=[...document.querySelectorAll(".nav a.l")];
if("IntersectionObserver" in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle("on",a.getAttribute("href")==="#"+e.target.id))}),{rootMargin:"-45% 0px -50% 0px"});
 links.forEach(a=>{const t=document.querySelector(a.getAttribute("href"));if(t)io.observe(t)})}
})();
