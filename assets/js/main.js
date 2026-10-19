(function(){
const DATA=window.PORTFOY;
const F=DATA.F.map(f=>({...f,sc:f.sc.filter(x=>x!=="Etüt Yazılımı")})),M=DATA.M,C=DATA.C;
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const fmt=n=>n.toLocaleString("tr-TR");
const AY=["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];
const AYL=["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
const ym=k=>{const[y,m]=k.split("-");return AYL[+m-1]+" "+y};
const tc=s=>s.toLocaleLowerCase("tr-TR").replace(/(^|[\s(\/-])(\S)/g,(a,b,c)=>b+c.toLocaleUpperCase("tr-TR"));
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
$("#lede").innerHTML=`Sanayi tesislerinde enerji verimliliği etütleri yürütüyor, ölçüm verisini yatırım kararına dönüşen teknik raporlara çeviriyorum. <b>${fmt(nF)} tesis</b>, <b>${C.length} il</b> ve <b>${abroad} yurt dışı projesi</b>.`;
$("#tags").innerHTML=["Trafo verimlilik analizi","Elektrik motoru değerlendirmesi","Pompa sistemleri","Buhar ve basınçlı hava","Saha ölçümü"].map(t=>`<span class="tag">${t}</span>`).join("");
$("#kpis").innerHTML=[[nF,"","Tesis portföyü"],[sDays,"f","Saha etüdü günü"],[rDays,"c","Rapor çalışma günü"],[C.length,"","İlde saha çalışması"]]
 .map(k=>`<div class="kpi"><b class="${k[1]}">${fmt(k[0])}</b><span>${k[2]}</span></div>`).join("");
(function(){const v=M.map(m=>m[1]+m[2]),f=M.map(m=>m[1]),mx=Math.max(...v),n=M.length;
 const pt=(a,i)=>[(i/(n-1))*1000,112-(a/mx)*96];
 const path=a=>{let d="";a.forEach((x,i)=>{const[X,Y]=pt(x,i);if(!i)d=`M${X},${Y}`;else{const[pX,pY]=pt(a[i-1],i-1),cx=(pX+X)/2;d+=` C${cx},${pY} ${cx},${Y} ${X},${Y}`}});return d};
 const p=path(v);
 $("#wave").innerHTML=`<defs><linearGradient id="wg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--glow)" stop-opacity=".28"/><stop offset="1" stop-color="var(--glow)" stop-opacity="0"/></linearGradient></defs><path class="a" d="${p} L1000,120 L0,120 Z"/><path class="l" d="${p}"/><path class="l2" d="${path(f)}"/>`;})();

/* Neden */
$("#why").innerHTML=[
 [both.length,"","Uçtan uca etüt","Aynı tesiste saha ölçümünü yapıp raporu da yazdığım proje sayısı."],
 [SE.length-(sc["Diğer Sanayi"]?1:0),"","Sektör deneyimi","Metal ve otomotivden gıdaya, tekstilden otel ve AVM'lere kadar."],
 [C.length,"","İlde sahadayım","İstanbul ve Kocaeli'den Adana, Kayseri ve Samsun'a uzanan saha çalışması."],
 [abroad,"","Uluslararası proje","Azerbaycan'da sanayi, otel ve sağlık tesislerine yönelik raporlar."]]
 .map(w=>`<div><b>${w[0]}${w[1]}</b><h3>${w[2]}</h3><p>${w[3]}</p></div>`).join("");

/* Uzmanlık */
const pbh=F.filter(f=>f.sc.some(x=>["Pompa","Buhar Sistemleri","Basınçlı Hava"].includes(x))).length;
const SK=[
 [has("Trafo"),"lead","Trafo verimlilik raporları","Transformatör kayıp ve yüklenme değerlendirmeleri. Portföyümün ana uzmanlık hattı."],
 [field.length,"f","Saha etüdü",`${C.length} ilde, ${fmt(sDays)} gün süren yerinde inceleme ve ölçüm.`],
 [has("Elektrik Motoru"),"","Elektrik motoru değerlendirmesi","Motor envanteri ve verimli motor dönüşümüne yönelik raporlar."],
 [pbh,"","Pompa, buhar ve basınçlı hava","Pompa sistemleri, buhar jeneratörü ve hava kaçağı değerlendirmeleri."]];
$("#skills").innerHTML=SK.map(s=>`<div class="skill ${s[1]}"><strong>${s[0]}</strong><h3>${s[2]}</h3><p>${s[3]}</p><div class="meter" role="img" aria-label="Portföyün %${Math.round(s[0]/nF*100)}'i"><i style="width:${(s[0]/nF*100).toFixed(1)}%"></i></div><span class="pct">Portföyün %${Math.round(s[0]/nF*100)}'i</span></div>`).join("");

/* Aylık grafik */
(function(){
 const W=1000,H=300,L=34,R=8,T=14,B=46,cw=(W-L-R)/M.length,bw=cw*.6;
 const mx=Math.max(...M.map(m=>m[1]+m[2]));const top=Math.ceil(mx/5)*5;
 const y=v=>T+(H-T-B)*(1-v/top);
 let g="";
 for(let v=0;v<=top;v+=5){g+=`<line class="grid" x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}"/><text x="${L-8}" y="${y(v)+4}" text-anchor="end">${v}</text>`}
 M.forEach((m,i)=>{const x=L+i*cw+(cw-bw)/2,[k,s,r]=m,[yy,mm]=k.split("-");
  if(s)g+=`<rect class="bf" x="${x}" y="${y(s)}" width="${bw}" height="${y(0)-y(s)}" rx="2"/>`;
  if(r)g+=`<rect class="br" x="${x}" y="${y(s+r)}" width="${bw}" height="${y(s)-y(s+r)-(s?1.5:0)}" rx="2"/>`;
  if((+mm-1)%3===0)g+=`<text x="${x+bw/2}" y="${H-B+18}" text-anchor="middle">${AY[+mm-1]}</text>`;
  if(mm==="01"||i===0)g+=`<text x="${x+bw/2}" y="${H-B+34}" text-anchor="middle" style="fill:var(--ink);font-weight:500">${yy}</text>`;
  g+=`<rect class="hit" data-i="${i}" x="${L+i*cw}" y="${T}" width="${cw}" height="${H-T-B}"/>`});
 $("#monthly").innerHTML=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Aylık saha ve rapor günleri">${g}</svg>`;
 const tip=$("#tip");
 $("#monthly").addEventListener("pointermove",e=>{const i=e.target.dataset&&e.target.dataset.i;if(i==null){tip.hidden=true;return}
  const m=M[+i];tip.innerHTML=`${ym(m[0])}<br>Saha ${m[1]} gün · Rapor ${m[2]} gün`;tip.hidden=false;
  const w=tip.offsetWidth;tip.style.left=Math.min(e.clientX+12,innerWidth-w-12)+"px";tip.style.top=(e.clientY-52)+"px"});
 $("#monthly").addEventListener("pointerleave",()=>tip.hidden=true);
 const PH={"2024":"Raporlama temeli","2025":"Sahaya geçiş","2026":"Saha liderliği"};
 $("#phases").innerHTML=Object.keys(PH).map(y=>{const a=M.filter(m=>m[0].startsWith(y)),s=sum(a,m=>m[1]),r=sum(a,m=>m[2]);
  return `<div class="phase"><b>${y}</b><h3>${PH[y]}</h3><div class="bar2"><span class="s" style="flex:${s}"></span><span class="r" style="flex:${r}"></span></div><p class="num">${s} saha günü · ${r} rapor günü</p></div>`}).join("");
})();

/* İller ve sektörler */
const cmax=Math.max(...C.map(c=>c.d));
$("#cities").innerHTML=C.slice().sort((a,b)=>b.d-a.d||b.n-a.n).map(c=>`<details class="city"><summary><div class="row"><span class="lbl">${esc(tc(c.c))}</span><span class="bar"><i style="width:${c.d/cmax*100}%"></i></span><span class="v">${c.d}</span></div></summary><p class="who">${c.n} tesis: ${esc(c.f)}</p></details>`).join("");
const smax=SE[0][1];
$("#sectors").innerHTML=SE.map(([k,v])=>`<div class="row sec"><span class="lbl">${esc(k)}</span><span class="bar"><i style="width:${v/smax*100}%"></i></span><span class="v">${v}</span></div>`).join("")+
 `<p class="note" style="margin-top:16px">Saha etüdü yapılan tesis: ${field.length} · yalnız rapor: ${nF-field.length}</p>`;
SE.forEach(([k])=>{const o=document.createElement("option");o.value=k;o.textContent=k;$("#sec").appendChild(o)});

/* Kartlar */
const dfmt=s=>{const[y,m]=s.split("-");return `${AY[+m-1]} ${y}`};
const per=f=>{const a=dfmt(f.a),b=dfmt(f.b);return a===b?a:a+" – "+b};
$("#cards").innerHTML=both.slice().sort((a,b)=>b.k-a.k||b.s-a.s).slice(0,6).map((f,i)=>`<article class="card">
 <div class="hd"><div class="meta"><span>${esc(tc(f.c))}</span><span class="rk">0${i+1}</span></div><h3>${esc(f.n)}</h3>
 <div class="split" role="img" aria-label="${f.s} saha, ${f.r} rapor günü"><span class="s" style="flex:${f.s}"></span><span class="r" style="flex:${f.r}"></span></div></div>
 <div class="bd"><dl><div><dt>Saha</dt><dd>${f.s}<small>gün</small></dd></div><div><dt>Rapor</dt><dd>${f.r}<small>gün</small></dd></div><div><dt>Kayıt</dt><dd>${f.k}</dd></div></dl>
 <div class="chips"><span class="chip f">Saha etüdü</span>${f.sc.map(x=>`<span class="chip">${esc(x)}</span>`).join("")}</div>
 <p class="note when">${esc(f.sec)} · ${per(f)}</p></div></article>`).join("");

/* Referans şeridi */
const names=F.slice().sort((a,b)=>b.k-a.k).slice(0,28).map(f=>f.n.replace(/\s*\(.*?\)\s*/g," ").replace(/\s+/g," ").trim());
const half=names.map(n=>`<span>${esc(n)}</span>`).join("");
$("#track").innerHTML=half+half.replace(/<span>/g,'<span aria-hidden="true">');

/* Tablo */
const st={q:"",t:"",sec:"",k:"k",dir:-1,all:false};
const pill=t=>t==="Saha Etüdü + Rapor"?'<span class="pill both">Saha + Rapor</span>':t==="Saha Etüdü"?'<span class="pill saha">Saha</span>':'<span class="pill rapor">Rapor</span>';
function draw(){
 const q=st.q.toLocaleLowerCase("tr-TR");
 let r=F.filter(f=>(!q||(f.n+" "+f.c).toLocaleLowerCase("tr-TR").includes(q))&&(!st.t||f.t===st.t)&&(!st.sec||f.sec===st.sec));
 r.sort((a,b)=>{const x=a[st.k],y=b[st.k];return (typeof x==="number"?x-y:String(x).localeCompare(String(y),"tr"))*st.dir||b.k-a.k});
 const n=r.length,show=st.all?r:r.slice(0,12);
 $("#tb").innerHTML=show.map(f=>`<tr><td><strong style="font-weight:600">${esc(f.n)}</strong><span class="sub">${esc(f.sec)}</span></td><td>${esc(tc(f.c))}</td><td>${pill(f.t)}</td><td>${f.sc.length?esc(f.sc.join(", ")):'<span class="sub">Saha etüdü</span>'}</td><td class="n">${f.s||"–"}</td><td class="n">${f.r||"–"}</td><td class="m">${per(f)}</td></tr>`).join("")||`<tr><td colspan="7" style="color:var(--muted)">Bu filtrelerle eşleşen tesis yok. Aramayı kısaltmayı veya filtreyi “Tümü” yapmayı deneyin.</td></tr>`;
 $("#count").textContent=`${show.length} / ${n} tesis gösteriliyor`;
 $("#more").hidden=n<=12;$("#more").textContent=st.all?"İlk 12'ye dön":"Tümünü göster ("+n+")";
}
$("#q").addEventListener("input",e=>{st.q=e.target.value;draw()});
$("#sec").addEventListener("change",e=>{st.sec=e.target.value;draw()});
$("#seg").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;st.t=b.dataset.v;
 $("#seg").querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));draw()});
document.querySelectorAll("th button").forEach(b=>b.addEventListener("click",()=>{const k=b.dataset.k;
 st.dir=st.k===k?-st.dir:(typeof F[0][k]==="number"?-1:1);st.k=k;draw()}));
$("#more").addEventListener("click",()=>{st.all=!st.all;draw()});
draw();
$("#foot").textContent=`${fmt(nF)} tesis · ${fmt(sDays+rDays)} görev günü`;

/* Menüde aktif bölüm */
const links=[...document.querySelectorAll(".nav a.l")];
if("IntersectionObserver" in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle("on",a.getAttribute("href")==="#"+e.target.id))}),{rootMargin:"-45% 0px -50% 0px"});
 links.forEach(a=>{const t=document.querySelector(a.getAttribute("href"));if(t)io.observe(t)})}
})();
