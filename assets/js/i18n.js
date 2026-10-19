/* Dil seçimi: ?lang= > kayıtlı tercih > tarayıcı dili. Türkçe metin HTML'de durur, İngilizce buradan uygulanır. */
(function(){
const EN={
"nav.exp": "Expertise",
"nav.car": "Career",
"nav.map": "Map",
"nav.prj": "Projects",
"nav.pf": "Portfolio",
"nav.ct": "Contact",
"hero.eb": "<span>Energy efficiency · Portfolio <span id=\"period\"></span></span>",
"hero.role": "Energy audit specialist who <span>measures on site and drives decisions</span> with reports",
"hero.cta1": "Get in touch →",
"hero.cta2": "Featured projects",
"hero.badge": "<b id=\"badgeN\">146</b><span>facilities in energy<br>efficiency work</span>",
"why.eb": "Why work with me",
"why.h": "From measurement to report, <em>end to end</em>",
"exp.eb": "Areas of expertise",
"exp.h": "From transformers to motors, <em>from site to report</em>",
"exp.l": "Each card shows the number of facilities where I worked in that area and its share of the 146-facility portfolio.",
"car.eb": "Career momentum",
"car.h": "From the desk <em>to the field</em>",
"car.l": "Task days per month. A journey that began with reporting has shifted to leading field audits since autumn 2025.",
"car.lg": "<span><i style=\"background:var(--field)\"></i>Field audit days</span><span><i style=\"background:var(--copper)\"></i>Report writing days</span>",
"map.eb": "<span>Field map</span>",
"map.h": "On site <em>across Türkiye</em>",
"map.l": "The <b id=\"mFieldN\">19</b> provinces where I carried out field audits glow by number of field days. Including the facilities I wrote reports for, my work reached <b id=\"mAllN\">33</b> provinces. Tap a province to see its facilities, or replay the journey from the start.",
"map.play": "Play the journey",
"map.lg": "<span><i class=\"lg-f\"></i>Field audit (darker = more days)</span><span><i class=\"lg-r\"></i>Report-only province</span><span class=\"src\">Map data © OpenStreetMap contributors (ODbL)</span>",
"sec.eb": "Sectors",
"sec.h": "Experience in <em>8 sectors</em>",
"sec.l": "Facilities with very different energy profiles, from metal and automotive to food, from textiles to hotels and shopping malls.",
"prj.eb": "Featured projects",
"prj.h": "Audits delivered <em>end to end</em>",
"prj.l": "Six of the 32 facilities where I ran both the field audit and the report, ranked by task days.",
"pf.eb": "Full portfolio",
"pf.h": "All <em>146</em> facilities",
"pf.all": "All",
"pf.both": "Field + Report",
"pf.f": "Field",
"pf.r": "Report",
"pf.allsec": "All sectors",
"th.n": "Facility",
"th.c": "Location",
"th.t": "Task",
"th.sc": "Scope",
"th.s": "Field",
"th.r": "Report",
"th.a": "Period",
"ct.eb": "<span>Contact</span>",
"ct.h": "Let's improve your facility's <em>energy efficiency together.</em>",
"ct.l": "Reach me by email or LinkedIn for field audits, transformer and motor efficiency reports, or career opportunities.",
"ct.m": "Email",
"ct.wm": "Work email",
"ct.li": "Open profile ↗",
"m.h": "Every number is backed by a calendar record",
"m.1": "<h3>Source</h3><p>The company facility list was matched against the task calendar, using the rows recorded under Mohamed for 2024–2026.</p>",
"m.2": "<h3>Classification</h3><p>“Etüt” entries naming a facility count as field tasks; “Rapor” entries count as report tasks.</p>",
"m.3": "<h3>Evidence</h3><p>All 429 task days trace back to a date, the original task text and a source cell. 43 entries without a reliable match were left out of the totals.</p>",
"ft": "© Mohamed Sallieu Bah · Energy audit portfolio",
"ct.copy": "Copy"
};
const ATTR={
"a0": "Main menu",
"a1": "Türkiye field audit map",
"a2": "Some of the facilities I have worked with",
"a3": "Task type",
"a4": "Sector",
"a5": "Search facility or province",
"a6": "Search facility or province"
};
let lang=new URLSearchParams(location.search).get("lang");
if(lang!=="tr"&&lang!=="en"){try{lang=localStorage.getItem("lang")}catch(e){}}
if(lang!=="tr"&&lang!=="en")lang=/^tr\b/i.test(navigator.language||"tr")?"tr":"en";
window.I18N={lang,L:(tr,en)=>lang==="en"?en:tr};
document.documentElement.lang=lang;
const btn=document.getElementById("lang");
if(btn){btn.textContent=lang==="en"?"TR":"EN";btn.setAttribute("aria-label",lang==="en"?"Türkçeye geç":"Switch to English");
 btn.addEventListener("click",()=>{const next=lang==="en"?"tr":"en";try{localStorage.setItem("lang",next)}catch(e){}
  const u=new URL(location.href);u.searchParams.set("lang",next);location.href=u.toString()})}
if(lang!=="en")return;
document.querySelectorAll("[data-i18n]").forEach(el=>{const v=EN[el.dataset.i18n];if(v!=null)el.innerHTML=v});
["aria-label","placeholder"].forEach(a=>document.querySelectorAll(`[data-i18n-${a}]`).forEach(el=>{const v=ATTR[el.getAttribute(`data-i18n-${a}`)];if(v)el.setAttribute(a,v)}));
document.title="Mohamed Sallieu Bah · Energy Audit Portfolio";
const m=document.querySelector('meta[name="description"]');
if(m)m.content="Mohamed Sallieu Bah – energy efficiency field audit and technical reporting portfolio: 146 facilities, 19 provinces, transformer and electric motor efficiency reports.";
})();
