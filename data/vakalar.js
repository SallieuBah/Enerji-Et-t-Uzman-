// Vaka çalışmaları: etüt raporlarındaki enerji verimliliği önlemleri (EVÖ).
// t: "Trafo" | "Motor" | "Pompa" · kwh: kWh/yıl · tep: TEP/yıl · tl: TL/yıl · co2: ton/yıl · inv: yatırım TL · go: geri ödeme (yıl, rapordaki değer)
window.VAKALAR=[
 {id:"zf1",tesis:"ZF Sachs Fabrika 1",il:"Kocaeli",sektor:"Metal, Otomotiv & Makine",
  evo:[
   {no:3,t:"Motor",n:"Soğutma kulesi 1 fanı · sürücü",en:"Cooling tower 1 fan · drive",d:"Soğutma kulesi 1 fanı sürücü uygulama projesi",de:"Variable speed drive for cooling tower 1 fan",kwh:10421,tep:0.9,tl:31951,co2:4.80,inv:196250,go:6.14},
   {no:4,t:"Motor",n:"Soğutma kulesi 2 fan 1 · sürücü",en:"Cooling tower 2 fan 1 · drive",d:"Soğutma kulesi 2 fan 1 sürücü uygulama projesi",de:"Variable speed drive for cooling tower 2 fan 1",kwh:12514,tep:1.1,tl:38368,co2:5.77,inv:196250,go:5.1},
   {no:5,t:"Motor",n:"Soğutma kulesi 2 fan 2 · sürücü",en:"Cooling tower 2 fan 2 · drive",d:"Soğutma kulesi 2 fan 2 sürücü uygulama projesi",de:"Variable speed drive for cooling tower 2 fan 2",kwh:16496,tep:1.4,tl:50577,co2:7.60,inv:196250,go:3.9},
   {no:6,t:"Motor",n:"Soğutma kulesi 3 fan 2 · sürücü",en:"Cooling tower 3 fan 2 · drive",d:"Soğutma kulesi 3 fan 2 sürücü uygulama projesi",de:"Variable speed drive for cooling tower 3 fan 2",kwh:41461,tep:3.6,tl:127119,co2:19.11,inv:425000,go:3.3},
   {no:7,t:"Motor",n:"Soğutma kulesi 3 fan 3 · sürücü",en:"Cooling tower 3 fan 3 · drive",d:"Soğutma kulesi 3 fan 3 sürücü uygulama projesi",de:"Variable speed drive for cooling tower 3 fan 3",kwh:41461,tep:3.6,tl:127119,co2:19.11,inv:425000,go:3.3},
   {no:8,t:"Trafo",n:"TR-1 (Giriş 2) · kompanzasyon panosu",en:"TR-1 (Incomer 2) · compensation panel",d:"TR-1 (Giriş 2) kompanzasyon panosu revize ve iyileştirme projesi",de:"Revision and upgrade of the TR-1 (Incomer 2) compensation panel",kwh:37626,tep:3.2,tl:115361,co2:17.35,inv:250000,go:2.2},
   {no:9,t:"Trafo",n:"TR-2 · kompanzasyon panosu",en:"TR-2 · compensation panel",d:"TR-2 kompanzasyon panosu revize ve iyileştirme projesi",de:"Revision and upgrade of the TR-2 compensation panel",kwh:85765,tep:7.4,tl:262955,co2:39.54,inv:350000,go:1.3},
   {no:10,t:"Trafo",n:"TR-3 · kompanzasyon panosu",en:"TR-3 · compensation panel",d:"TR-3 kompanzasyon panosu revize ve iyileştirme projesi",de:"Revision and upgrade of the TR-3 compensation panel",kwh:62888,tep:5.4,tl:192815,co2:28.99,inv:400000,go:2.1},
   {no:11,t:"Pompa",n:"Pompa 6 · soğutma kulesi 3 pompası değişimi",en:"Pump 6 · cooling tower 3 pump replacement",d:"Pompa 6 – soğutma kulesi 3 (yeni kule) pompası 2 değişim projesi",de:"Pump 6 – replacing pump 2 of cooling tower 3 (new tower)",kwh:37823,tep:3.3,tl:115965,co2:17.44,inv:510000,go:4.4},
   {no:12,t:"Pompa",n:"Pompa 7 · chiller 2 sirkülasyon pompası",en:"Pump 7 · chiller 2 circulation pump",d:"Pompa 7 – chiller 2 sirkülasyon pompası değişim projesi",de:"Pump 7 – replacing the chiller 2 circulation pump",kwh:23555,tep:2.0,tl:72220,co2:10.86,inv:378857,go:5.2},
   {no:13,t:"Pompa",n:"Pompa kaplama",en:"Pump coating",d:"Pompa kaplama projesi",de:"Pump coating project",kwh:11047,tep:1.0,tl:33870,co2:5.09,inv:214286,go:6.3}
  ]},
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
