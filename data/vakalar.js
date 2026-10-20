// Vaka çalışmaları: etüt raporlarındaki enerji verimliliği önlemleri (EVÖ).
// t: "Trafo" | "Motor" · kwh: kWh/yıl · tep: TEP/yıl · tl: TL/yıl · co2: ton/yıl · inv: yatırım TL · go: geri ödeme (yıl, rapordaki değer)
window.VAKALAR=[
 {id:"kervan",tesis:"Kervan Gıda",il:"Manisa",sektor:"Gıda & İçecek",
  evo:[
   {no:6,t:"Trafo",n:"Trafo 1-2 · Aktif harmonik filtre",en:"Transformer 1-2 · Active harmonic filter",d:"Trafo 1-2 trafosunda aktif harmonik filtre ile harmonik kayıpların azaltılması",de:"Reducing harmonic losses on transformer 1-2 with an active harmonic filter",kwh:114000,tep:9.8,tl:458850,co2:52.55,inv:980800,go:2.1},
   {no:7,t:"Trafo",n:"Trafo 1-3 · Aktif harmonik filtre",en:"Transformer 1-3 · Active harmonic filter",d:"Trafo 1-3 trafosunda aktif harmonik filtre ile harmonik kayıpların azaltılması",de:"Reducing harmonic losses on transformer 1-3 with an active harmonic filter",kwh:111930,tep:9.6,tl:450518,co2:51.60,inv:980000,go:2.2},
   {no:8,t:"Trafo",n:"Trafo 1-4 · Aktif harmonik filtre",en:"Transformer 1-4 · Active harmonic filter",d:"Trafo 1-4 trafosunda aktif harmonik filtre ile harmonik kayıpların azaltılması",de:"Reducing harmonic losses on transformer 1-4 with an active harmonic filter",kwh:180870,tep:15.6,tl:728002,co2:83.38,inv:1471200,go:2.0},
   {no:9,t:"Trafo",n:"Trafo 2-2 · Aktif harmonik filtre",en:"Transformer 2-2 · Active harmonic filter",d:"Trafo 2-2 trafosunda aktif harmonik filtre ile harmonik kayıpların azaltılması",de:"Reducing harmonic losses on transformer 2-2 with an active harmonic filter",kwh:142523,tep:12.3,tl:573655,co2:65.70,inv:980800,go:1.7},
   {no:10,t:"Trafo",n:"Trafo 2-1 · Boşta kayıpların önlenmesi",en:"Transformer 2-1 · Eliminating no-load losses",d:"Trafo 2-1 trafosunda boşta kayıpların önlenmesi ile enerji tasarrufu çalışması",de:"Energy saving by eliminating no-load losses on transformer 2-1",kwh:16920,tep:1.5,tl:68103,co2:7.80,inv:60000,go:0.9},
   {no:11,t:"Motor",n:"Chiller kule pompası · IE4 motor",en:"Chiller tower pump · IE4 motor",d:"Climaveneta chiller soğutma kulesi pompası 1 motorunun IE4 motor ile değişimi",de:"Replacing the Climaveneta chiller cooling tower pump 1 motor with an IE4 motor",kwh:5646,tep:0.5,tl:22725,co2:2.60,inv:115000,go:5.1},
   {no:12,t:"Motor",n:"Kondenser pompası · IE4 motor",en:"Condenser pump · IE4 motor",d:"Trane su soğutmalı chiller kondenser pompası (kuleden chillere) 1 motorunun IE4 motor ile değişimi",de:"Replacing the Trane water-cooled chiller condenser pump (tower to chiller) 1 motor with an IE4 motor",kwh:1936,tep:0.2,tl:7792,co2:0.89,inv:95000,go:12.2}
  ]}
];
